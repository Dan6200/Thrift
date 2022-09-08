import db from '../db';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/';
import './helper-functions';
import { UserPayload } from '../types-and-interfaces';
const fileName = require('path').basename(__filename);

let createProduct = async (request, response) => {
	let { userId }: UserPayload = request.user;
	await db.query(
		`insert into product values (
			title,
			category,
			description,
			list_price,
			net_price,
			vendor_id
		)`,
		[userId]
	);
	response.status(StatusCodes.CREATED).json({
		newProductId: userId,
	});
};

let getProduct = async (request, response) => {
	let result = (
		await db.query(
			`select * from product
		where product_id=$1`,
			[userId]
		)
	).rows[0];
	if (!result) throw new NotFoundError('product  cannot be found');
	response.status(StatusCodes.OK).json({
		productId: userId,
	});
};

let updateProduct = async (request, response) => {};

let deleteProduct = async (request, response) => {
	await db.query(
		`delete from product
		where product_id=$1`,
		[userId]
	);
	response.status(StatusCodes.OK).end();
};

export { createProduct, getProduct, updateProduct, deleteProduct };
