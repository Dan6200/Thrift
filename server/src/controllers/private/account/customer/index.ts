import { StatusCodes } from 'http-status-codes'
import { QueryResult, QueryResultRow } from 'pg'
import { ProcessRouteWithoutBodyAndDBResult } from '../../../../types-and-interfaces/process-routes.js'
import { ResponseData } from '../../../../types-and-interfaces/response.js'
import {
	InsertInTable,
	DeleteInTable,
} from '../../../helpers/generate-sql-commands/index.js'
import processRoute from '../../../helpers/process-route.js'
import db from '../../../../db/pg/index.js'
import { RequestWithPayload } from '../../../../types-and-interfaces/request.js'

const { CREATED, NOT_FOUND, NO_CONTENT } = StatusCodes

/**
 * @param {QueryResult<QueryResultRow>} result
 * @returns {Promise<ResponseData>}
 * @description Validate the result of the query
 * If the result is empty, return a 404 status code
 * Otherwise, return an empty object
 * */
const validateResult = async (
	result: QueryResult<QueryResultRow>
): Promise<ResponseData> => {
	if (result.rows.length === 0)
		return {
			status: NOT_FOUND,
			data: 'Route does not exit',
		}
	return {
		data: {},
	}
}
/**
 * @param {RequestWithPayload} req
 * @returns {Promise<void>}
 * @description Add a customer account to the database
 **/
const createQuery = async ({
	user: { userId: customerId },
}: RequestWithPayload): Promise<void> => {
	let result = await db.query({
		text: InsertInTable('customers', ['customer_id'], 'customer_id'),
		values: [customerId],
	})
	await validateResult(result)
}

/**
 * @param {RequestWithPayload} req
 * @returns {Promise<void>}
 * @description Delete the customer account from the database
 **/
const deleteQuery = async ({
	user: { userId: customerId },
}: RequestWithPayload): Promise<void> => {
	let result = await db.query({
		text: DeleteInTable('customers', 'customer_id', 'customer_id=$1'),
		values: [customerId],
	})
	await validateResult(result)
}

const processPostRoute = <ProcessRouteWithoutBodyAndDBResult>processRoute
const createCustomerAccount = processPostRoute(
	createQuery,
	CREATED,
	undefined,
	undefined
)

const processDeleteRoute = <ProcessRouteWithoutBodyAndDBResult>processRoute
const deleteCustomerAccount = processDeleteRoute(
	deleteQuery,
	NO_CONTENT,
	undefined,
	undefined
)

export { createCustomerAccount, deleteCustomerAccount }
