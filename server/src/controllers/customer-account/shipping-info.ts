import { Response } from 'express';
import {
	RequestUserPayload,
	RequestWithPayload,
} from 'types-and-interfaces/request';
import db from 'db';
import joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from 'errors/';
import { genSqlUpdateCommands } from 'controllers/helper-functions';
import {
	ShippingInfoSchemaReq,
	ShippingInfoSchemaDB,
} from 'app-schema/customer/shipping';
import assert from 'node:assert/strict';

const selectShippingInfo = `
select 
	address_id,
	recepient_first_name,
	recepient_last_name,
	street,
	postal_code,
	delivery_contact,
	delivery_instructions,
	is_primary
from shipping_info where customer_id=$1`;

const createShippingInfo = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { userId: customerId }: RequestUserPayload = request.user;
	// limit amount of shippingInfo to 5...
	const LIMIT = 5;
	const rowCount = (await db.query('select * from shipping_info')).rowCount;
	assert.ok(typeof rowCount === 'number');
	// TODO: make sure only one is_primary value exists
	let overLimit: boolean = LIMIT <= rowCount;
	if (overLimit)
		throw new BadRequestError(
			`Each customer is limited to only ${LIMIT} shipping addresses`
		);
	const validData = ShippingInfoSchemaReq.validate(request.body);
	if (validData.error)
		throw new BadRequestError(
			'Invalid Data Schema: ' + validData.error.message
		);
	const shippingData = validData.value;
	await db.query(
		`insert into shipping_info(
			customer_id,
			recepient_first_name,
			recepient_last_name,
			street,
			postal_code,
			delivery_contact,
			delivery_instructions,
			is_primary
		) values ($1, $2, $3, $4, $5, $6, $7, $8)`,
		[customerId, ...Object.values(shippingData)]
	);
	let addressId: string = (
		await db.query('select address_id from shipping_info')
	).rows[0].address_id;
	response.status(StatusCodes.CREATED).send({
		addressId,
	});
};

const getAllShippingInfo = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { userId: customerId } = request.user;
	const shippingInfos = (await db.query(selectShippingInfo, [customerId]))
		.rows;
	if (!shippingInfos)
		return response
			.status(StatusCodes.NOT_FOUND)
			.send('customer has no shipping information available');
	joi.assert(shippingInfos[0], ShippingInfoSchemaDB);
	response.status(StatusCodes.OK).send({ shippingInfos });
};

const getShippingInfo = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { addressId } = request.params;
	if (!addressId) throw new BadRequestError('Id parameter not available');
	const shippingInfo = (await db.query(selectShippingInfo, [addressId]))
		.rows[0];
	if (!shippingInfo)
		return response
			.status(StatusCodes.NOT_FOUND)
			.send('Shipping Information cannot be found');
	joi.assert(shippingInfo, ShippingInfoSchemaDB);
	response.status(StatusCodes.OK).send({ shippingInfo });
};

const updateShippingInfo = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { addressId } = request.params,
		shippingData = request.body;
	let fields = Object.keys(shippingData),
		data = Object.values(shippingData),
		offset = 2;
	await db.query(
		`${genSqlUpdateCommands(
			'shipping_info',
			'address_id',
			fields,
			offset
		)}`,
		[addressId, ...data]
	);
	const shippingInfo = (await db.query(selectShippingInfo, [addressId]))
		.rows[0];
	joi.assert(shippingInfo, ShippingInfoSchemaDB);
	if (!shippingInfo)
		return response
			.status(StatusCodes.NOT_FOUND)
			.send('Shipping Information cannot be found');
	response.status(StatusCodes.OK).send();
};

const deleteShippingInfo = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { addressId } = request.params;
	await db.query(
		`delete from shipping_info
			where address_id=$1`,
		[addressId]
	);
	response.status(StatusCodes.NO_CONTENT).send();
};

export {
	createShippingInfo,
	getShippingInfo,
	getAllShippingInfo,
	updateShippingInfo,
	deleteShippingInfo,
};
