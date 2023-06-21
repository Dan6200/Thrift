import { StatusCodes } from 'http-status-codes'
import { QueryResult } from 'pg'
import {
	ProductSchemaDB,
	ProductSchemaReq,
} from '../../../../../app-schema/products.js'
import db from '../../../../../db/index.js'
import BadRequestError from '../../../../../errors/bad-request.js'
import UnauthenticatedError from '../../../../../errors/unauthenticated.js'
import { ResponseData } from '../../../../../types-and-interfaces/response.js'
import {
	Insert,
	Update,
} from '../../../../helpers/generate-sql-commands/index.js'
import { handleSortQuery } from '../../../../helpers/generate-sql-commands/query-params-handler.js'
import processRoute from '../../../../helpers/process-route.js'

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
	if (!dbQuery.rows.length)
		throw new BadRequestError('Store does not exist. Create a store')
	if (dbQuery.rows[0].vendor_id !== vendorId)
		throw new UnauthenticatedError('Cannot access store.')
	return db.query(
		`${Insert(
			'products',
			[...Object.keys(productData), 'store_id', 'vendor_id'],
			'product_id'
		)}`,
		[...Object.values(productData), storeId, vendorId]
	)
}

const readAllQuery = async ({
	queries: { sort, limit, offset },
	params: { storeId },
	userId: vendorId,
}) => {
	const dbQuery = await db.query(
		'select vendor_id from stores where store_id=$1',
		[storeId]
	)
	if (!dbQuery.rows.length)
		throw new BadRequestError('Store does not exist. Create a store')
	if (dbQuery.rows[0].vendor_id !== vendorId)
		throw new UnauthenticatedError('Cannot access store.')
	let dbQueryString = `
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
		dbQueryString += ` ${handleSortQuery(sort)}`
	}
	if (offset) dbQueryString += ` offset ${offset}`
	if (limit) dbQueryString += ` limit ${limit}`
	return db.query(dbQueryString, [storeId])
}

const readQuery = async ({
	params: { storeId, productId },
	userId: vendorId,
}) => {
	const dbQuery = await db.query(
		'select vendor_id from stores where store_id=$1',
		[storeId]
	)
	if (!dbQuery.rows.length)
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

const updateQuery = async ({
	params: { productId, storeId },
	reqData: productData,
	userId: vendorId,
}) => {
	const dbQuery = await db.query(
		'select vendor_id from stores where store_id=$1',
		[storeId]
	)
	if (!dbQuery.rows.length)
		throw new BadRequestError('Store does not exist. Create a store')
	if (dbQuery.rows[0].vendor_id !== vendorId)
		throw new UnauthenticatedError('Cannot access store.')
	const updateCommand =
		Update('products', 'product_id', Object.keys(productData)) +
		` returning product_id`
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
	if (!dbQuery.rows.length)
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

const { CREATED, OK, NOT_FOUND } = StatusCodes

const validateResult = (result: QueryResult<any>): ResponseData => {
	if (!result.rows.length)
		return {
			status: NOT_FOUND,
			data: 'Product not found',
		}
	const validateDbResult = ProductSchemaDB.validate(result.rows[0])
	if (validateDbResult.error)
		throw new BadRequestError(
			'Invalid Data from DB: ' + validateDbResult.error.message
		)
	return {
		data: validateDbResult.value,
	}
}

const createProduct = processRoute(
	createQuery,
	CREATED,
	validateBody,
	validateResult
)

const getAllProducts = processRoute(readAllQuery, OK, undefined, validateResult)

const getProduct = processRoute(readQuery, OK, undefined, validateResult)

const updateProduct = processRoute(
	updateQuery,
	OK,
	validateBody,
	validateResult
)

const deleteProduct = processRoute(deleteQuery, OK, undefined, validateResult)

export {
	createProduct,
	getAllProducts,
	getProduct,
	updateProduct,
	deleteProduct,
}
