import { StatusCodes } from 'http-status-codes'
import { QueryResult } from 'pg'
import {
	ProductSchemaDB,
	ProductSchemaDBList,
	ProductSchemaReq,
} from '../../../../../app-schema/products.js'
import db from '../../../../../db/index.js'
import BadRequestError from '../../../../../errors/bad-request.js'
import UnauthenticatedError from '../../../../../errors/unauthenticated.js'
import {
	ProcessRouteWithBodyAndDBResult,
	ProcessRouteWithoutBody,
} from '../../../../../types-and-interfaces/process-routes.js'
import { RequestWithPayload } from '../../../../../types-and-interfaces/request.js'
import { ResponseData } from '../../../../../types-and-interfaces/response.js'
import {
	Delete,
	Insert,
	Select,
	Update,
} from '../../../../helpers/generate-sql-commands/index.js'
import { handleSortQuery } from '../../../../helpers/generate-sql-commands/query-params-handler.js'
import processRoute from '../../../../helpers/process-route.js'

const createQuery = async ({
	body: productData,
	params: { storeId },
	user: { userId: vendorId },
}: RequestWithPayload) => {
	// makes sure the Store exists before accessing the /user/stores/products endpoint
	const dbQuery = await db.query({
		text: Select('stores', ['vendor_id'], 'store_id=$1'),
		values: [storeId],
	})
	if (!dbQuery.rows.length)
		throw new BadRequestError('Store does not exist. Create a store')
	if (dbQuery.rows[0].vendor_id !== vendorId)
		throw new UnauthenticatedError('Cannot access store.')
	return db.query({
		text: Insert(
			'products',
			[...Object.keys(productData), 'store_id', 'vendor_id'],
			'product_id'
		),
		values: [...Object.values(productData), storeId, vendorId],
	})
}

const readAllQuery = async ({
	query: { sort, limit, offset },
	params: { storeId },
	user: { userId: vendorId },
}: RequestWithPayload) => {
	const dbQuery = await db.query({
		text: Select('stores', ['vendor_id'], 'store_id=$1'),
		values: [storeId],
	})
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
		dbQueryString += ` ${handleSortQuery(<string>sort)}`
	}
	if (offset) dbQueryString += ` offset ${offset}`
	if (limit) dbQueryString += ` limit ${limit}`
	return db.query({ text: dbQueryString, values: [storeId] })
}

const readQuery = async ({
	params: { storeId, productId },
	user: { userId: vendorId },
}: RequestWithPayload) => {
	const dbQuery = await db.query({
		text: Select('stores', ['vendor_id'], 'store_id=$1'),
		values: [storeId],
	})
	if (!dbQuery.rows.length)
		throw new BadRequestError('Store does not exist. Create a store')
	if (dbQuery.rows[0].vendor_id !== vendorId)
		throw new UnauthenticatedError('Cannot access store.')
	return db.query({
		text: `select products.*, 
				(select json_agg(media) from 
					(select filename, 
						filepath, description from 
							product_media 
							where product_id=$1)
						as media) 
					as media 
				from products 
			where product_id=$1`,
		values: [productId],
	})
}

const updateQuery = async ({
	params: { productId, storeId },
	body: productData,
	user: { userId: vendorId },
}: RequestWithPayload) => {
	const dbQuery = await db.query({
		text: Select('stores', ['vendor_id'], 'store_id=$1'),
		values: [storeId],
	})
	if (!dbQuery.rows.length)
		throw new BadRequestError('Store does not exist. Create a store')
	if (dbQuery.rows[0].vendor_id !== vendorId)
		throw new UnauthenticatedError('Cannot access store.')
	const paramList = [...Object.values(productData), productId]
	const pos: number = paramList.length
	const updateCommand = Update(
		'products',
		'product_id',
		Object.keys(productData),
		`product_id=$${pos}`
	)

	return db.query({
		text: updateCommand,
		values: paramList,
	})
}

const deleteQuery = async ({
	params: { productId, storeId },
	user: { userId: vendorId },
}: RequestWithPayload) => {
	const dbQuery = await db.query({
		text: Select('stores', ['vendor_id'], 'store_id=$1'),
		values: [storeId],
	})
	if (!dbQuery.rows.length)
		throw new BadRequestError('Store does not exist. Create a store')
	if (dbQuery.rows[0].vendor_id !== vendorId)
		throw new UnauthenticatedError('Cannot access store.')
	return db.query({
		text: Delete('products', 'product_id', 'product_id=$1 and store_id=$2'),
		values: [productId, storeId],
	})
}

const validateBody = <T>(data: T): void => {
	const validData = ProductSchemaReq.validate(data)
	if (validData.error)
		throw new BadRequestError('Invalid Data Schema: ' + validData.error.message)
	return validData.value
}

const { CREATED, OK, NOT_FOUND } = StatusCodes

const validateResultList = (result: QueryResult<any>): ResponseData => {
	if (!result.rows.length)
		return {
			status: NOT_FOUND,
			data: 'No Product found. Please create a product.',
		}
	const validateDbResult = ProductSchemaDBList.validate(result.rows)
	if (validateDbResult.error)
		throw new BadRequestError(
			'Invalid Data from DB: ' + validateDbResult.error.message
		)
	return {
		data: validateDbResult.value,
	}
}

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

const processPostRoute = <ProcessRouteWithBodyAndDBResult>processRoute
const processGetAllRoute = <ProcessRouteWithoutBody>processRoute
const processGetIDRoute = <ProcessRouteWithoutBody>processRoute
const processPutRoute = <ProcessRouteWithBodyAndDBResult>processRoute
const processDeleteRoute = <ProcessRouteWithoutBody>processRoute

const createProduct = processPostRoute(
	createQuery,
	CREATED,
	validateBody,
	validateResult
)

const getAllProducts = processGetAllRoute(readAllQuery, OK, validateResultList)

const getProduct = processGetIDRoute(readQuery, OK, validateResult)

const updateProduct = processPutRoute(
	updateQuery,
	OK,
	validateBody,
	validateResult
)

const deleteProduct = processDeleteRoute(deleteQuery, OK, validateResult)

export {
	createProduct,
	getAllProducts,
	getProduct,
	updateProduct,
	deleteProduct,
}
