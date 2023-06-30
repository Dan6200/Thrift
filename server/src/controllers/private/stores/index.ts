import { StatusCodes } from 'http-status-codes'
import { QueryResult, QueryResultRow } from 'pg'
import {
	StoreSchemaReqData,
	StoreSchemaReqDataPartial,
	StoreSchemaDBResult,
	StoreSchemaDBResultLean,
} from '../../../app-schema/stores.js'
import BadRequestError from '../../../errors/bad-request.js'
import UnauthenticatedError from '../../../errors/unauthenticated.js'
import {
	ProcessRouteWithBodyAndDBResult,
	ProcessRouteWithoutBody,
} from '../../../types-and-interfaces/process-routes.js'
import { RequestWithPayload } from '../../../types-and-interfaces/request.js'
import { ResponseData } from '../../../types-and-interfaces/response.js'
import {
	SelectFromTable,
	InsertInTable,
	UpdateInTable,
	DeleteInTable,
} from '../../helpers/generate-sql-commands/index.js'
import processRoute from '../../helpers/process-route.js'
import db from '../../../db/pg/index.js'

const createQuery = async ({
	body: storeData,
	user: { userId: vendorId },
}: RequestWithPayload) => {
	if (!vendorId) throw new UnauthenticatedError('Cannot access resource')
	// check if vendor account exists
	const dbRes = await db.query({
		text: SelectFromTable('vendors', ['1'], 'vendor_id=$1'), //'select 1 from vendors where vendor_id=$1',
		values: [vendorId],
	})
	if (dbRes.rows.length === 0)
		throw new BadRequestError(
			'No Vendor account found. Please create a Vendor account'
		)
	let recordsCount = <number>(
		await db.query({
			text: SelectFromTable('stores', ['1'], 'vendor_id=$1'),
			values: [vendorId],
		})
	).rows.length
	// limit amount of stores
	const LIMIT = 5
	// if Over limit throw error
	if (LIMIT <= recordsCount)
		throw new BadRequestError(`Each vendor is limited to only ${LIMIT} stores`)

	if (!storeData) throw new BadRequestError('No data sent in request body')

	return db.query({
		text: InsertInTable(
			'stores',
			['vendor_id', ...Object.keys(storeData)],
			'store_id'
		),
		values: [vendorId, ...Object.values(storeData)],
	})
}

const readAllQuery = async ({
	user: { userId: vendorId },
}: RequestWithPayload) => {
	if (!vendorId) throw new UnauthenticatedError('Cannot access resource')
	const res = await db.query({
		text: SelectFromTable('vendors', ['1'], 'vendor_id=$1'), // 'select 1 from vendors where vendor_id=$1',
		values: [vendorId],
	})
	if (res.rows.length === 0)
		throw new BadRequestError(
			'No Vendor account found. Please create a Vendor account'
		)
	return db.query({
		text: SelectFromTable('stores', ['*'], 'vendor_id=$1'),
		values: [vendorId],
	})
}

const readQuery = async ({
	params,
	user: { userId: vendorId },
}: RequestWithPayload) => {
	const { storeId } = params
	if (!vendorId) throw new UnauthenticatedError('Cannot access resource')
	const res = await db.query({
		text: SelectFromTable('vendors', ['1'], 'vendor_id=$1'), //'select 1 from vendors where vendor_id=$1',
		values: [vendorId],
	})
	if (res.rows.length === 0)
		throw new BadRequestError(
			'No Vendor account found. Please create a Vendor account'
		)
	return db.query({
		text: SelectFromTable('stores', ['*'], `store_id=$1`), //`select * from stores where store_id=$1`,
		values: [storeId],
	})
}

const updateQuery = async ({
	params,
	body: storeData,
	user: { userId: vendorId },
}: RequestWithPayload) => {
	const { storeId } = params
	if (!storeId) throw new BadRequestError('Need Id param to update resource')
	const res = await db.query({
		text: SelectFromTable('vendors', ['1'], 'vendor_id=$1'),
		values: [vendorId],
	})
	if (res.rows.length === 0)
		throw new BadRequestError(
			'No Vendor account found. Please create a Vendor account'
		)
	let fields = Object.keys(storeData),
		data = Object.values(storeData)
	const paramList = [storeId, ...data]
	const condition = `store_id=$1`
	const query = {
		text: UpdateInTable('stores', 'store_id', fields, 2, condition),
		values: paramList,
	}
	return db.query(query)
}

const deleteQuery = async ({
	params,
	user: { userId: vendorId },
}: RequestWithPayload) => {
	const { storeId } = params
	const res = await db.query({
		text: 'select vendor_id from vendors where vendor_id=$1',
		values: [vendorId],
	})
	if (res.rows.length === 0)
		throw new BadRequestError(
			'No Vendor account found. Please create a Vendor account'
		)
	return db.query({
		text: DeleteInTable('stores', 'store_id', 'store_id=$1'),
		values: [storeId],
	})
}

const validateBody = async <T>(data: T) => {
	const validData = StoreSchemaReqData.validate(data)
	if (validData.error)
		throw new BadRequestError('Invalid Data Schema: ' + validData.error.message)
}

const validateBodyUpdate = async <T>(data: T) => {
	const validData = StoreSchemaReqDataPartial.validate(data)
	if (validData.error)
		throw new BadRequestError('Invalid Data Schema: ' + validData.error.message)
}

const validateResultList = async (
	result: QueryResult<QueryResultRow>
): Promise<ResponseData> => {
	if (result.rows.length === 0)
		return {
			status: NOT_FOUND,
			data: 'No stores found. Please add a store',
		}
	const validData = StoreSchemaDBResult.validate(result.rows)
	if (validData.error)
		throw new BadRequestError('Invalid Data Schema: ' + validData.error.message)
	return {
		data: validData.value,
	}
}

const validateResult = async (
	result: QueryResult<QueryResultRow>
): Promise<ResponseData> => {
	if (result.rows.length === 0)
		return {
			status: NOT_FOUND,
			data: 'Store not found',
		}
	const validData = StoreSchemaDBResult.validate(result.rows[0])
	if (validData.error)
		throw new BadRequestError('Invalid Data Schema: ' + validData.error.message)
	return {
		data: validData.value,
	}
}

const validateResultHasId = async (
	result: QueryResult<QueryResultRow>
): Promise<ResponseData> => {
	const { error, value } = StoreSchemaDBResultLean.validate(result.rows[0])
	if (error) throw new BadRequestError('The operation was Unsuccessful')
	return {
		data: value,
	}
}
const { CREATED, OK, NOT_FOUND } = StatusCodes

const processPostRoute = <ProcessRouteWithBodyAndDBResult>processRoute
const createStore = processPostRoute(
	createQuery,
	CREATED,
	validateBody,
	validateResultHasId
)

const processGetAllRoute = <ProcessRouteWithoutBody>processRoute
const getAllStores = processGetAllRoute(
	readAllQuery,
	OK,
	undefined,
	validateResultList
)

const processGetIDRoute = <ProcessRouteWithoutBody>processRoute
const getStore = processGetIDRoute(readQuery, OK, undefined, validateResult)

const processPutRoute = <ProcessRouteWithBodyAndDBResult>processRoute
const updateStore = processPutRoute(
	updateQuery,
	OK,
	validateBodyUpdate,
	validateResultHasId
)

const processDeleteRoute = <ProcessRouteWithoutBody>processRoute
const deleteStore = processDeleteRoute(
	deleteQuery,
	OK,
	undefined,
	validateResultHasId
)

export { createStore, getStore, getAllStores, updateStore, deleteStore }
