import { log } from 'console'
import { StatusCodes } from 'http-status-codes'
import {
	ProductSchemaReq,
	ProductSchemaUpdateReq,
} from '../../../../../app-schema/products.js'
import db from '../../../../../db/index.js'
import BadRequestError from '../../../../../errors/bad-request.js'
import UnauthenticatedError from '../../../../../errors/unauthenticated.js'
import {
	Insert,
	Update,
} from '../../../../helpers/generate-sql-commands/index.js'
import { handleSortQuery } from '../../../../helpers/generate-sql-commands/query-params-handler.js'
import processRoute from '../../../../helpers/process-route.js'

const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes
type Status = typeof CREATED | typeof OK | typeof NO_CONTENT | typeof NOT_FOUND

type ResponseData = {
	status: Status
	data?: string | object
}

const createQuery = async ({
	reqData: productData,
	params: { storeId },
	userId: vendorId,
}) => {
	// makes sure the Store exists before accessing the /user/stores/products endpoint
	const dbQuery = await db.query(
		'select vendor_id from stores where store_id=$1',
		[storeId]
	)
	if (!dbQuery.rowCount)
		throw new BadRequestError('Store does not exist. Create a store')
	if (dbQuery.rows[0].vendor_id !== vendorId)
		throw new UnauthenticatedError('Cannot access store.')
	return db.query(
		`${Insert('products', [
			...Object.keys(productData),
			'store_id',
			'vendor_id',
		])} returning product_id`,
		[...Object.values(productData), storeId, vendorId]
	)
}

const readAllQuery = async ({
	query: { sort, limit, offset },
	params: { storeId },
	userId: vendorId,
}) => {
	const dbQuery = await db.query(
		'select vendor_id from stores where store_id=$1',
		[storeId]
	)
	if (!dbQuery.rowCount)
		throw new BadRequestError('Store does not exist. Create a store')
	if (dbQuery.rows[0].vendor_id !== vendorId)
		throw new UnauthenticatedError('Cannot access store.')
	let queryString = `
		select products.*, 
			(select json_agg(media) from 
				(select filename, 
					filepath, description from 
						product_media 
							where 
								product_id=products.product_id)
							as media) 
						as media 
					from products 
				where store_id=$1`
	if (sort) {
		queryString += ` ${handleSortQuery(sort)}`
	}
	if (offset) queryString += ` offset ${offset}`
	if (limit) queryString += ` limit ${limit}`
	const dbResponse = db.query(queryString, [storeId])
	log(queryString, (await dbResponse).rows)
	return dbResponse
}

const readQuery = async ({
	params: { storeId, productId },
	userId: vendorId,
}) => {
	const dbQuery = await db.query(
		'select vendor_id from stores where store_id=$1',
		[storeId]
	)
	if (!dbQuery.rowCount)
		throw new BadRequestError('Store does not exist. Create a store')
	if (dbQuery.rows[0].vendor_id !== vendorId)
		throw new UnauthenticatedError('Cannot access store.')
	return db.query(
		`select products.*, 
				(select json_agg(media) from 
					(select filename, 
						filepath, description from 
							product_media 
							where product_id=$1)
							as media) 
						as media 
					from products 
				where product_id=$1`,
		[productId]
	)
}

const replaceQuery = async ({
	params: { productId, storeId },
	reqData: productData,
	userId: vendorId,
}) => {
	const dbQuery = await db.query(
		'select vendor_id from stores where store_id=$1',
		[storeId]
	)
	if (!dbQuery.rowCount)
		throw new BadRequestError('Store does not exist. Create a store')
	if (dbQuery.rows[0].vendor_id !== vendorId)
		throw new UnauthenticatedError('Cannot access store.')
	return db.query(
		`${Update('products', 'product_id', [
			...Object.keys(productData),
			'store_id',
			'vendor_id',
		])} returning product_id`,
		[productId, ...Object.values(productData), storeId, vendorId]
	)
}

const updateQuery = async ({
	params: { productId, storeId },
	reqData: productData,
	userId: vendorId,
}) => {
	const dbQuery = await db.query(
		'select vendor_id from stores where store_id=$1',
		[storeId]
	)
	if (!dbQuery.rowCount)
		throw new BadRequestError('Store does not exist. Create a store')
	if (dbQuery.rows[0].vendor_id !== vendorId)
		throw new UnauthenticatedError('Cannot access store.')
	const updateCommand =
		Update('products', 'product_id', Object.keys(productData)) +
		' ' +
		'returning product_id'
	return db.query(updateCommand, [productId, ...Object.values(productData)])
}

const deleteQuery = async ({
	params: { productId, storeId },
	userId: vendorId,
}) => {
	const dbQuery = await db.query(
		'select vendor_id from stores where store_id=$1',
		[storeId]
	)
	if (!dbQuery.rowCount)
		throw new BadRequestError('Store does not exist. Create a store')
	if (dbQuery.rows[0].vendor_id !== vendorId)
		throw new UnauthenticatedError('Cannot access store.')
	return db.query(
		`delete from products where product_id=$1 and store_id=$2 returning product_id`,
		[productId, storeId]
	)
}

const validateBody = (data: object): object => {
	const validData = ProductSchemaReq.validate(data)
	if (validData.error)
		throw new BadRequestError('Invalid Data Schema: ' + validData.error.message)
	return validData.value
}

const validateBodyPatchUpdate = (data: object): object => {
	const validData = ProductSchemaUpdateReq.validate(data)
	if (validData.error)
		throw new BadRequestError('Invalid Data Schema: ' + validData.error.message)
	return validData.value
}

const validateListResult = (result: any, status: Status): ResponseData => {
	if (result.rowCount === 0)
		return {
			status: 404,
			data: { msg: 'No products found. Please add a product for sale' },
		}
	return {
		status,
		data: result.rows,
	}
}

const validateResult = (result: any, status: Status): ResponseData => {
	if (result.rowCount === 0)
		return {
			status: 404,
			data: { msg: 'Product not found' },
		}
	return {
		status,
		data: result.rows[result.rowCount - 1],
	}
}

const createProduct = processRoute(
	createQuery,
	{ status: CREATED },
	validateBody,
	validateResult
)

const getAllProducts = processRoute(
	readAllQuery,
	{ status: OK },
	undefined,
	validateListResult
)

const getProduct = processRoute(
	readQuery,
	{ status: OK },
	undefined,
	validateResult
)

const updateProduct = processRoute(
	updateQuery,
	{ status: OK },
	validateBodyPatchUpdate,
	validateResult
)

const replaceProduct = processRoute(
	replaceQuery,
	{ status: OK },
	validateBody,
	validateResult
)

const deleteProduct = processRoute(
	deleteQuery,
	{ status: OK },
	undefined,
	validateResult
)

export {
	createProduct,
	getAllProducts,
	getProduct,
	updateProduct,
	replaceProduct,
	deleteProduct,
}
