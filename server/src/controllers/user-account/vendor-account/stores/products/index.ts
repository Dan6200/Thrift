import { StatusCodes } from 'http-status-codes'
import {
	ProductSchemaDB,
	ProductSchemaReq,
	ProductSchemaUpdateReq,
} from '../../../../../app-schema/products.js'
import db from '../../../../../db/index.js'
import BadRequestError from '../../../../../errors/bad-request.js'
import UnauthenticatedError from '../../../../../errors/unauthenticated.js'
import {
	ResponseData,
	Status,
} from '../../../../../types-and-interfaces/response.js'
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
	if (!dbQuery.rowCount)
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
	if (!dbQuery.rowCount)
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
			status: NOT_FOUND,
			data: { msg: 'No products found. Please add a product for sale' },
		}
	// validateResult(result.rows[0])
	return {
		status,
		data: result.rows,
	}
}

const validateResult = (result: any, status: Status): ResponseData => {
	if (!result.rowCount)
	{
		const dbResult = ProductSchemaDB.validate(result)
		return {
			status: NOT_FOUND,
			data: { msg: 'Product not found' },
		}
	return {
		status,
		data: result.rows[result.rowCount - 1],
	}
}

const { CREATED, OK, NOT_FOUND } = StatusCodes

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
	deleteProduct,
}
