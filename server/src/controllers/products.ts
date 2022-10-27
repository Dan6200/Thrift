import db from 'db';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from 'errors/';
import 'helper-functions';
import { ProductSchemaReq } from 'app-schema/product';
import processRoute from './helpers/process-route';
import { ResponseData, Status } from 'types-and-interfaces/routes-processor';
// const fileName = require('path').basename(__filename);
const { CREATED, OK, NO_CONTENT } = StatusCodes;

let insertProductTable = `insert into product values (
	title,
	category,
	description,
	list_price,
	net_price,
	vendor_id
)`;

const createQuery = [
	async ({ reqData }) => {
		// TODO: check if an insert statement returns a value
		return await db.query(insertProductTable, [reqData]);
	},
	async () => {
		return await db.query('select product_id from product');
	},
];

const readAllQuery = [
	async () => {
		await db.query(`select * from product`);
	},
];

const readQuery = [
	async ({ params }) => {
		let { productId } = params;
		await db.query(`select * from product where product_id=$1`, [
			productId,
		]);
	},
];

// TODO: make this a patch not put
const updateQuery = [
	async ({ params }) => {
		let { productId } = params;
		await db.query(`update product where product_id=$1`, [productId]);
	},
];

const deleteQuery = [
	async ({ params }) => {
		let { productId } = params;
		await db.query(`delete from product where product_id=$1`, [productId]);
	},
];

let validateBody = (data: object): object => {
	const validData = ProductSchemaReq.validate(data);
	if (validData.error)
		throw new BadRequestError(
			'Invalid Data Schema: ' + validData.error.message
		);
	return validData.value;
};

let validateResult = (result: any, status: Status): ResponseData => {
	if (result.rowCount === 0)
		return {
			status: 404,
			data: { msg: 'Route does not exit' },
		};
	return {
		status,
		data: result.rows[result.rowCount - 1],
	};
};

let createProduct = processRoute(
	createQuery,
	{ status: OK },
	validateBody,
	validateResult
);

let getAllProducts = processRoute(
	readAllQuery,
	{ status: OK },
	validateBody,
	validateResult
);

let getProduct = processRoute(
	readQuery,
	{ status: OK },
	validateBody,
	validateResult
);

export { createProduct, getAllProducts, getProduct };
