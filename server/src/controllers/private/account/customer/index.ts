import { StatusCodes } from 'http-status-codes'
import { QueryResult, QueryResultRow } from 'pg'
import {
	CRUDQueryAuth,
	ProcessRouteWithoutBody,
	ProcessRouteWithoutBodyAndDBResult,
} from '../../../../types-and-interfaces/process-routes.js'
import { ResponseData } from '../../../../types-and-interfaces/response.js'
import {
	InsertInTable,
	SelectFromTable,
	DeleteInTable,
} from '../../../helpers/generate-sql-commands/index.js'
import processRoute from '../../../helpers/process-route.js'
import db from '../../../../db/pg/index.js'

const { CREATED, NOT_FOUND, OK } = StatusCodes

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

const createQuery: CRUDQueryAuth = async ({ user: { userId: customerId } }) => {
	let result = await db.query({
		text: InsertInTable('customers', ['customer_id'], 'customer_id'),
		values: [customerId],
	})
	await validateResult(result)
}

const deleteQuery: CRUDQueryAuth = async ({ user: { userId: customerId } }) => {
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
	OK,
	undefined,
	undefined
)

export { createCustomerAccount, getCustomerAccount, deleteCustomerAccount }
