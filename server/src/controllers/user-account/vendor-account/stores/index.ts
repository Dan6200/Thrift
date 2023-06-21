import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { QueryResult, QueryResultRow } from 'pg'
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
import {
	Delete,
	Insert,
	Select,
	Update,
} from '../../../helpers/generate-sql-commands/index.js'
import processRoute from '../../../helpers/process-route.js'

const createQuery = async ({ reqData: storeData, userId: vendorId }) => {
	// check if vendor account exists
	const dbRes = await db.query({
		text: Select('vendors', ['1'], 'vendor_id=$1'), //'select 1 from vendors where vendor_id=$1',
		values: [vendorId],
	})
	if (dbRes.rows.length === 0)
		throw new BadRequestError(
			'No Vendor account found. Please create a Vendor account'
		)
	// limit amount of stores to 5...
	const LIMIT = 5
	let recordCount = <number>(
		await db.query({
			text: Select('stores', ['1'], 'vendor_id=$1'),
			values: [vendorId],
		})
	).rows.length
	// if Over limit throw error
	if (LIMIT <= recordCount)
		throw new BadRequestError(`Each vendor is limited to only ${LIMIT} stores`)
	return db.query({
		text: Insert(
			'stores',
			['vendor_id', ...Object.keys(storeData)],
			'store_id'
		),
		values: [vendorId, ...Object.values(storeData)],
	})
}

const readAllQuery = async ({ userId: vendorId }) => {
	const res = await db.query({
		text: Select('vendors', ['1'], 'vendor_id=$1'), // 'select 1 from vendors where vendor_id=$1',
		values: [vendorId],
	})
	if (res.rows.length === 0)
		throw new BadRequestError(
			'No Vendor account found. Please create a Vendor account'
		)
	return db.query({
		text: Select('stores', ['*'], 'vendor_id=$1'),
		values: [vendorId],
	})
}

const readQuery = async ({ params: { storeId }, userId: vendorId }) => {
	const res = await db.query({
		text: Select('vendors', ['1'], 'vendor_id=$1'), //'select 1 from vendors where vendor_id=$1',
		values: [vendorId],
	})
	if (res.rows.length === 0)
		throw new BadRequestError(
			'No Vendor account found. Please create a Vendor account'
		)
	return db.query({
		text: Select('stores', ['*'], `store_id=$1`), //`select * from stores where store_id=$1`,
		values: [storeId],
	})
}

const updateQuery = async ({
	params: { storeId },
	reqData: storeData,
	userId: vendorId,
}) => {
	const res = await db.query({
		text: Select('vendors', ['1'], 'vendor_id=$1'),
		values: [vendorId],
	})
	if (res.rows.length === 0)
		throw new BadRequestError(
			'No Vendor account found. Please create a Vendor account'
		)
	let fields = Object.keys(storeData),
		data = Object.values(storeData)
	const position = fields.length + 1
	const condition = `store_id=$${position}`
	const query = {
		text: Update('stores', 'store_id', fields, condition),
		values: [...data, storeId],
	}
	return db.query(query)
}

const deleteQuery = async ({ params: { storeId }, userId: vendorId }) => {
	const res = await db.query({
		text: 'select vendor_id from vendors where vendor_id=$1',
		values: [vendorId],
	})
	if (res.rows.length === 0)
		throw new BadRequestError(
			'No Vendor account found. Please create a Vendor account'
		)
	return db.query({
		text: Delete('stores', 'store_id', 'store_id'),
		values: [storeId],
	})
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

const validateResultList = (
	result: QueryResult<QueryResultRow>
): ResponseData => {
	if (result.rows.length === 0)
		return {
			status: NOT_FOUND,
			data: 'No stores found. Please add a store',
		}
	const validData = StoreSchemaDB.validate(result.rows)
	if (validData.error)
		throw new BadRequestError('Invalid Data Schema: ' + validData.error.message)
	return {
		data: validData.value,
	}
}

const validateResult = (result: QueryResult<QueryResultRow>): ResponseData => {
	if (result.rows.length === 0)
		return {
			status: NOT_FOUND,
			data: 'Store not found',
		}
	const validData = StoreSchemaDB.validate(result.rows[0])
	if (validData.error)
		throw new BadRequestError('Invalid Data Schema: ' + validData.error.message)
	return {
		data: validData.value,
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
