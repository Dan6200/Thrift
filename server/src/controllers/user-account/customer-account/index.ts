import { StatusCodes } from 'http-status-codes'
import { QueryResult, QueryResultRow } from 'pg'
import db from '../../../db/pg/index.js'
import {
	CRUDQueryAuth,
	ProcessRouteWithoutBody,
} from '../../../types-and-interfaces/process-routes.js'
import { ResponseData } from '../../../types-and-interfaces/response.js'
import {
	DeleteInTable,
	InsertInTable,
	SelectFromTable,
} from '../../helpers/generate-sql-commands/index.js'
import processRoute from '../../helpers/process-route.js'
const { CREATED, NOT_FOUND, OK } = StatusCodes

const createQuery: CRUDQueryAuth = ({ user: { userId: customerId } }) =>
	db.query({
		text: InsertInTable('customers', ['customer_id'], 'customer_id'), //`insert into customers values($1) returning customer_id`,
		values: [customerId],
	})

const readQuery: CRUDQueryAuth = ({ user: { userId: customerId } }) =>
	db.query({
		text: SelectFromTable('customers', ['1'], 'customer_id=$1'),
		values: [customerId],
	})

const deleteQuery: CRUDQueryAuth = ({ user: { userId: customerId } }) =>
	db.query({
		text: DeleteInTable('customers', 'customer_id', 'customer_id=$1'),
		values: [customerId],
	})

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

// Saves from a nasty bugs
const processPostRoute = <ProcessRouteWithoutBody>processRoute
const createCustomerAccount = processPostRoute(
	createQuery,
	CREATED,
	undefined,
	validateResult
)

const processGetRoute = <ProcessRouteWithoutBody>processRoute
const getCustomerAccount = processGetRoute(
	readQuery,
	OK,
	undefined,
	validateResult
)

const processDeleteRoute = <ProcessRouteWithoutBody>processRoute
const deleteCustomerAccount = processDeleteRoute(
	deleteQuery,
	OK,
	undefined,
	validateResult
)

export { createCustomerAccount, getCustomerAccount, deleteCustomerAccount }
