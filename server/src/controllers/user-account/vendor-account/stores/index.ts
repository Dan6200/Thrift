import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import {
	StoreSchemaReq,
	StoreSchemaDB,
	UpdateStoreSchemaReq,
} from '../../../../app-schema/vendor/store.js'
import db from '../../../../db/index.js'
import { BadRequestError } from '../../../../errors/index.js'
import {
	ProcessRouteWithBodyAndDBResult,
	ProcessRouteWithoutBody,
	ProcessRouteWithoutBodyAndDBResult,
} from '../../../../types-and-interfaces/process-routes.js'
import {
	RequestWithPayload,
	RequestUserPayload,
} from '../../../../types-and-interfaces/request.js'
import {
	ResponseData,
	Status,
} from '../../../../types-and-interfaces/response.js'
import { Insert, Update } from '../../../helpers/generate-sql-commands/index.js'
import processRoute from '../../../helpers/process-route.js'

const createQuery = async ({ reqData: storeData, userId: vendorId }) => {
	// check if vendor account exists
	const dbRes = await db.query(
		'select vendor_id from vendors where vendor_id=$1',
		[vendorId]
	)
	if (dbRes.rowCount === 0)
		throw new BadRequestError(
			'No Vendor account found. Please create a Vendor account'
		)
	// limit amount of stores to 5...
	const LIMIT = 5
	let recordCount = <number>(
		(await db.query('select 1 from stores where vendor_id=$1', [vendorId]))
			.rowCount
	)
	// if Over limit throw error
	if (LIMIT <= recordCount)
		throw new BadRequestError(`Each vendor is limited to only ${LIMIT} stores`)
	return await db.query(
		`${Insert('stores', ['vendor_id', ...Object.keys(storeData)], 'store_id')}`,
		[vendorId, ...Object.values(storeData)]
	)
}

const readAllQuery = async ({ userId: vendorId }) => {
	const res = await db.query(
		'select vendor_id from vendors where vendor_id=$1',
		[vendorId]
	)
	if (res.rowCount === 0)
		throw new BadRequestError(
			'No Vendor account found. Please create a Vendor account'
		)
	return await db.query(`select * from stores where vendor_id=$1`, [vendorId])
}

const readQuery = async ({ params: { storeId }, userId: vendorId }) => {
	const res = await db.query(
		'select vendor_id from vendors where vendor_id=$1',
		[vendorId]
	)
	if (res.rowCount === 0)
		throw new BadRequestError(
			'No Vendor account found. Please create a Vendor account'
		)
	return await db.query(`select * from stores where store_id=$1`, [storeId])
}

const updateQuery = async ({
	params: { storeId },
	reqData: storeData,
	userId: vendorId,
}) => {
	const res = await db.query(
		'select vendor_id from vendors where vendor_id=$1',
		[vendorId]
	)
	if (res.rowCount === 0)
		throw new BadRequestError(
			'No Vendor account found. Please create a Vendor account'
		)
	let fields = Object.keys(storeData),
		data = Object.values(storeData)
	return db.query(
		`${Update('stores', 'store_id', fields)} returning store_id`,
		[storeId, ...data]
	)
}

const deleteQuery = async ({ params: { storeId }, userId: vendorId }) => {
	const res = await db.query(
		'select vendor_id from vendors where vendor_id=$1',
		[vendorId]
	)
	if (res.rowCount === 0)
		throw new BadRequestError(
			'No Vendor account found. Please create a Vendor account'
		)
	return db.query(
		`delete from stores
			where store_id=$1`,
		[storeId]
	)
}

const validateBody = (data: object): object => {
	const validData = StoreSchemaReq.validate(data)
	if (validData.error)
		throw new BadRequestError('Invalid Data Schema: ' + validData.error.message)
	return validData.value
}

const validateBodyUpdate = (data: object): object => {
	const validData = UpdateStoreSchemaReq.validate(data)
	if (validData.error)
		throw new BadRequestError('Invalid Data Schema: ' + validData.error.message)
	return validData.value
}

const validateResult = (result: any): ResponseData => {
	if (result.rowCount === 0)
		return {
			status: NOT_FOUND,
			data: 'Store not found',
		}
	return {
		data: result.rows[result.rowCount - 1],
	}
}

const validateResultList = (data: any): ResponseData => {
	if (data.rowCount === 0)
		return {
			status: NOT_FOUND,
			data: 'No products found. Please add a product for sale',
		}
	return {
		data,
	}
}

const { CREATED, OK, NOT_FOUND } = StatusCodes

const processPostRoute = <ProcessRouteWithBodyAndDBResult>processRoute
const createStore = processPostRoute(
	createQuery,
	CREATED,
	validateBody,
	validateResult
)

const processGetAllRoute = <ProcessRouteWithoutBody>processRoute
const getAllStores = processGetAllRoute(readAllQuery, OK, validateResultList)

const processGetIDRoute = <ProcessRouteWithoutBody>processRoute
const getStore = processGetIDRoute(readQuery, OK, validateResult)

const processPutRoute = <ProcessRouteWithBodyAndDBResult>processRoute
const updateStore = processPutRoute(
	updateQuery,
	OK,
	validateBodyUpdate,
	validateResult
)

const processDeleteRoute = <ProcessRouteWithoutBody>processRoute
const deleteStore = processDeleteRoute(deleteQuery, OK, validateResult)

export { createStore, getStore, getAllStores, updateStore, deleteStore }
