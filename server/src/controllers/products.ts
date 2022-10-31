import db from 'db';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from 'errors/';
import 'helper-functions';
import { ProductSchemaReq } from 'app-schema/product';
import processRoute from './helpers/process-route';
import { ResponseData, Status } from 'types-and-interfaces/routes-processor';
import { genSqlUpdateCommands } from 'helper-functions';
const filename = require('path').basename(__filename);
const { CREATED, OK } = StatusCodes;

let insertProductTable = `insert into product (
	title,
	category,
	description,
	list_price,
	net_price,
	quantity_available,
	vendor_id
) values ($1, $2, $3, $4, $5, $6, $7)`;

const createQuery = [
	async ({ reqData, userId }) => {
		// TODO: check if an insert statement returns a value
		return await db.query(insertProductTable, [
			...Object.values(reqData),
			userId,
		]);
	},
	async () => await db.query('select product_id from product'),
];

const readAllQuery = [async () => await db.query(`select * from product`)];

const readQuery = [
	async ({ params }) => {
		let { productId } = params;
		return await db.query(`select * from product where product_id=$1`, [
			productId,
		]);
	},
];

const updateQuery = [
	async ({ params, reqData }) => {
		let { productId } = params,
			updateCommand = genSqlUpdateCommands(
				'product',
				'product_id',
				Object.keys(reqData)
			);
		return await db.query(updateCommand, [
			productId,
			...Object.values(reqData),
		]);
	},
];

const deleteQuery = [
	async ({ params }) => {
		let { productId } = params;
		return await db.query(`delete from product where product_id=$1`, [
			productId,
		]);
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
	{ status: CREATED },
	validateBody,
	validateResult
);

let getAllProducts = processRoute(
	readAllQuery,
	{ status: OK },
	undefined,
	validateResult
);

let getProduct = processRoute(
	readQuery,
	{ status: OK },
	undefined,
	validateResult
);

let updateProduct = processRoute(
	updateQuery,
	{ status: OK },
	undefined,
	validateResult
);

let deleteProduct = processRoute(
	deleteQuery,
	{ status: OK },
	undefined,
	validateResult
);

export {
	createProduct,
	getAllProducts,
	getProduct,
	updateProduct,
	deleteProduct,
};
