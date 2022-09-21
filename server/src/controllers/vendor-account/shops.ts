import { Response } from 'express';
import {
	RequestUserPayload,
	RequestWithPayload,
} from 'types-and-interfaces/request';
import db from 'db';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from 'errors/';
import { genSqlUpdateCommands } from 'controllers/helper-functions';
import { ShopSchema } from 'app-schema/vendor/shop';
import assert from 'node:assert/strict';
import Joi from 'joi';

const createShop = async (request: RequestWithPayload, response: Response) => {
	const { userId: vendorId }: RequestUserPayload = request.user;
	// limit amount of shops to 5...
	const LIMIT = 5;
	let recordCount: number = (
		await db.query('select count(vendor_id) from shop')
	).rows[0].count;
	assert.ok(typeof recordCount === 'number');
	let overLimit: boolean = LIMIT <= recordCount;
	if (overLimit)
		throw new BadRequestError(
			`Each vendor is limited to only ${LIMIT} shops`
		);
	let validData = ShopSchema.validate(request.body);
	if (validData.error)
		throw new BadRequestError('Invalid data schema: ' + validData.error);
	const shopData = validData.value;
	await db.query(
		`insert into shop(
			shop_name,
			vendor_id,
			banner_image_path
		) values ($1, $2, $3, $4, $5, $6, $7, $8)`,
		[vendorId, ...Object.values(shopData)]
	);
	let shop = (await db.query('select * from shop')).rows[0];
	Joi.assert(shop, ShopSchema);
	response.status(StatusCodes.CREATED).json({
		shop,
	});
};

const getAllShops = async (request: RequestWithPayload, response: Response) => {
	const { userId: vendorId }: RequestUserPayload = request.user;
	const shops = (
		await db.query(`select * from shop where vendor_id=$1`, [vendorId])
	).rows;
	if (shops.length === 0)
		return response
			.status(StatusCodes.NOT_FOUND)
			.send('Vendor has no shops available');
	Joi.assert(shops[0], ShopSchema);
	response.status(StatusCodes.OK).send(shops);
};

const getShop = async (request: RequestWithPayload, response: Response) => {
	const { shopId } = request.params;
	const shop = (
		await db.query(`select * from shop where shop_id=$1`, [shopId])
	).rows[0];
	if (!shop)
		return response
			.status(StatusCodes.NOT_FOUND)
			.send('Shipping Information cannot be found');
	response.status(StatusCodes.OK).send(shop);
};

const updateShop = async (request: RequestWithPayload, response: Response) => {
	// TODO: change to put
	const { shopId } = request.params;
	let validData = ShopSchema.validate(request.body);
	if (validData.error)
		throw new BadRequestError(
			'Invalid request data' + validData.error.message
		);
	const shopData = validData.value;
	let fields = Object.keys(shopData),
		data = Object.values(shopData),
		offset = 2;
	await db.query(
		`${genSqlUpdateCommands('shop', 'shop_id', fields, offset)}`,
		[shopId, ...data]
	);
	const shop = (
		await db.query(`select * from shop where shop_id=$1`, [shopId])
	).rows[0];
	Joi.assert(shop, ShopSchema);
	if (!shop) throw new BadRequestError('Put request was unsuccessful');
	response.status(StatusCodes.OK).send(shop);
};

const deleteShop = async (request: RequestWithPayload, response: Response) => {
	const { shopId } = request.params;
	await db.query(
		`delete from shop
			where shop_id=$1`,
		[shopId]
	);
	response.status(StatusCodes.OK).send();
};

export { createShop, getShop, getAllShops, updateShop, deleteShop };
