import { StatusCodes } from 'http-status-codes'
import { QueryResult, QueryResultRow } from 'pg'
import {
	ShippingInfoSchemaReq,
	ShippingInfoSchemaDBList,
	ShippingInfoSchemaID,
	ShippingInfoSchemaDB,
} from '../../../app-schema/shipping.js'
import db from '../../../db/pg/index.js'
import { BadRequestError, UnauthenticatedError } from '../../../errors/index.js'
import {
	ProcessRouteWithBodyAndDBResult,
	ProcessRouteWithoutBody,
} from '../../../types-and-interfaces/process-routes.js'
import { RequestWithPayload } from '../../../types-and-interfaces/request.js'
import { ResponseData } from '../../../types-and-interfaces/response.js'
import {
	DeleteInTable,
	InsertInTable,
	SelectFromTable,
	UpdateInTable,
} from '../../helpers/generate-sql-commands/index.js'
import processRoute from '../../helpers/process-route.js'

/**
 * @param {RequestWithPayload} req
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Create a new shipping info for a customer
 * Checks:
 * 1. If the customer exists
 * 2. If the customer already has 5 shipping addresses
 **/
const createQuery = async ({
	body: shippingData,
	user: { userId: customerId },
}: RequestWithPayload): Promise<QueryResult<QueryResultRow>> => {
	if (!customerId) throw new UnauthenticatedError('Cannot access resource')
	// check if customer account exists
	const dbRes = await db.query({
		text: SelectFromTable('customers', ['1'], 'customer_id=$1'),
		values: [customerId],
	})
	if (dbRes.rows.length === 0)
		throw new BadRequestError(
			'No Customer account found. Please create a Customer account'
		)
	// Limit the amount of shipping addresses a user can have:
	const LIMIT = 5
	const count: number = (
		await db.query({
			text: SelectFromTable('shipping_info', ['1'], 'customer_id=$1'),
			values: [customerId],
		})
	).rows.length
	if (count > LIMIT)
		throw new BadRequestError(`Cannot have more than ${LIMIT} stores`)
	if (!shippingData) throw new BadRequestError('No data sent in request body')
	return db.query({
		text: InsertInTable(
			'shipping_info',
			['customer_id', ...Object.keys(shippingData)],
			'shipping_info_id'
		),
		values: [customerId, ...Object.values(shippingData)],
	})
}

/**
 * @param {RequestWithPayload} req
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieves all the shipping info for a customer
 * Checks:
 * 1. If the customer account exists
 **/

const getAllQuery = async ({
	user: { userId: customerId },
}: RequestWithPayload): Promise<QueryResult<QueryResultRow>> => {
	if (!customerId) throw new UnauthenticatedError('Cannot access resource')
	const res = await db.query({
		text: SelectFromTable('customers', ['1'], 'customer_id=$1'),
		values: [customerId],
	})
	if (res.rows.length === 0)
		throw new BadRequestError(
			'No Customer account found. Please create a Customer account'
		)
	return db.query({
		text: SelectFromTable('shipping_info', ['*'], 'customer_id=$1'),
		values: [customerId],
	})
}

/**
 * @param {RequestWithPayload} req
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieves a single shipping info for a customer
 * Checks:
 * 1. If the customer account exists
 **/

const getQuery = async ({
	params,
	user: { userId: customerId },
}: RequestWithPayload): Promise<QueryResult<QueryResultRow>> => {
	const { shippingInfoId } = params
	if (!customerId) throw new UnauthenticatedError('Cannot access resource')
	const res = await db.query({
		text: SelectFromTable('customers', ['1'], 'customer_id=$1'),
		values: [customerId],
	})
	if (res.rows.length === 0)
		throw new BadRequestError(
			'No Customer account found. Please create a Customer account'
		)
	return db.query({
		text: SelectFromTable('shipping_info', ['*'], `shipping_info_id=$1`),
		values: [shippingInfoId],
	})
}

/**
 * @param {RequestWithPayload} req
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Updates shipping info for the customer
 * Checks:
 * 1. If the customer owns the shipping info
 * 2. If the shipping info ID is provided
 * 3. If the customer exists
 **/
const updateQuery = async ({
	params,
	body: shippingData,
	user: { userId: customerId },
}: RequestWithPayload): Promise<QueryResult<QueryResultRow>> => {
	const { shippingInfoId } = params
	if (!shippingInfoId) throw new BadRequestError('Need ID to update resource')
	if (!customerId) throw new UnauthenticatedError('Cannot access resource')
	const res = await db.query({
		text: SelectFromTable('customers', ['1'], 'customer_id=$1'),
		values: [customerId],
	})
	if (res.rows.length === 0)
		throw new BadRequestError(
			'No Customer account found. Please create a Customer account'
		)
	let fields = Object.keys(shippingData),
		data = Object.values(shippingData)
	const condition = `shipping_info_id=$1`
	const query = {
		text: UpdateInTable(
			'shipping_info',
			'shipping_info_id',
			fields,
			2,
			condition
		),
		values: [shippingInfoId, ...data],
	}
	return db.query(query)
}

/**
 * @param {RequestWithPayload} req
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Deletes a shipping info for the customer
 * Checks:
 * 1. If Id is provided
 * 2. If Customer account exists
 * 3. If Customer owns the shipping info
 */
const deleteQuery = async ({
	params,
	user: { userId: customerId },
}: RequestWithPayload): Promise<QueryResult<QueryResultRow>> => {
	const { shippingInfoId } = params
	if (!shippingInfoId)
		throw new BadRequestError('Need Id param to delete resource')
	if (!customerId) throw new UnauthenticatedError('Cannot access resource')
	const res = await db.query({
		text: SelectFromTable('customers', ['1'], 'customer_id=$1'),
		values: [customerId],
	})
	if (res.rows.length === 0)
		throw new BadRequestError(
			'No Customer account found. Please create a Customer account'
		)
	return db.query({
		text: DeleteInTable(
			'shipping_info',
			'shipping_info_id',
			'shipping_info_id=$1'
		),
		values: [shippingInfoId],
	})
}

const { CREATED, OK, NOT_FOUND } = StatusCodes

/**
 * @param {T} data
 * @returns {Promise<void>}
 * @description Validates the request body
 **/

const validateBody = async <T>(data: T): Promise<void> => {
	const validData = ShippingInfoSchemaReq.validate(data)
	if (validData.error)
		throw new BadRequestError('Invalid Data Schema: ' + validData.error.message)
}

/**
 * @param {QueryResult<QueryResultRow>} result
 * @returns {Promise<ResponseData>}
 * @description Validates the result of the query returned as a list of shipping info
 * Checks:
 * 1. If the result is empty
 * 2. If the result is valid
 **/
const validateResultList = async (
	result: QueryResult<QueryResultRow>
): Promise<ResponseData> => {
	if (result.rows.length === 0)
		return {
			status: NOT_FOUND,
			data: 'No stores found. Please add a store',
		}
	const validData = ShippingInfoSchemaDBList.validate(result.rows)
	if (validData.error)
		throw new BadRequestError('Invalid Data Schema: ' + validData.error.message)
	return {
		data: validData.value,
	}
}

/**
 * @param {QueryResult<QueryResultRow>} result
 * @returns {Promise<ResponseData>}
 * @description Validates the result of the query returned as a single shipping info
 * Checks:
 * 1. If the result is empty
 * 2. If the result is valid
 **/
const validateResult = async (
	result: QueryResult<QueryResultRow>
): Promise<ResponseData> => {
	if (result.rows.length === 0)
		return {
			status: NOT_FOUND,
			data: 'ShippingInfo not found',
		}
	const validData = ShippingInfoSchemaDB.validate(result.rows[0])
	if (validData.error)
		throw new BadRequestError('Invalid Data Schema: ' + validData.error.message)
	return {
		data: validData.value,
	}
}

/**
 * @param {QueryResult<QueryResultRow>} result
 * @returns {Promise<ResponseData>}
 * @description Checks to see if Id is returned and operation is successful
 **/
const validateResultHasId = async (
	result: QueryResult<QueryResultRow>
): Promise<ResponseData> => {
	const { error, value } = ShippingInfoSchemaID.validate(result.rows[0])
	if (error) throw new BadRequestError('The operation was Unsuccessful')
	return {
		data: value,
	}
}

const processPostRoute = <ProcessRouteWithBodyAndDBResult>processRoute
const createShippingInfo = processPostRoute(
	createQuery,
	CREATED,
	validateBody,
	validateResultHasId
)

const processGetAllRoute = <ProcessRouteWithoutBody>processRoute
const getAllShippingInfo = processGetAllRoute(
	getAllQuery,
	OK,
	undefined,
	validateResultList
)

const processGetIDRoute = <ProcessRouteWithoutBody>processRoute
const getShippingInfo = processGetIDRoute(
	getQuery,
	OK,
	undefined,
	validateResult
)

const processPutRoute = <ProcessRouteWithBodyAndDBResult>processRoute
const updateShippingInfo = processPutRoute(
	updateQuery,
	OK,
	validateBody,
	validateResultHasId
)

const processDeleteRoute = <ProcessRouteWithoutBody>processRoute
const deleteShippingInfo = processDeleteRoute(
	deleteQuery,
	OK,
	undefined,
	validateResultHasId
)

export {
	createShippingInfo,
	getShippingInfo,
	getAllShippingInfo,
	updateShippingInfo,
	deleteShippingInfo,
}
