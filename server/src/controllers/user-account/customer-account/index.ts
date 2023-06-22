import { StatusCodes } from 'http-status-codes'
import { QueryResult, QueryResultRow } from 'pg'
import db from '../../../db/index.js'
import BadRequestError from '../../../errors/bad-request.js'
import {
	CRUDQueryAuth,
	ProcessRouteWithoutBody,
	ProcessRouteWithoutBodyAndDBResult,
} from '../../../types-and-interfaces/process-routes.js'
import { ResponseData } from '../../../types-and-interfaces/response.js'
import {
	Delete,
	Insert,
	Select,
} from '../../helpers/generate-sql-commands/index.js'
import processRoute from '../../helpers/process-route.js'
import { CustomerDBResultSchema } from '../../../app-schema/customer/index.js'
const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes

const createQuery: CRUDQueryAuth = ({ userId: customerId }) =>
	db.query({
		text: Insert('customers', ['customer_id'], 'customer_id'), //`insert into customers values($1) returning customer_id`,
		values: [customerId],
	})

const readQuery: CRUDQueryAuth = ({ userId: customerId }) =>
	db.query({
		text: Select('customers', ['1'], 'customer_id=$1'),
		values: [customerId],
	})

const deleteQuery: CRUDQueryAuth = ({ userId: customerId }) =>
	db.query({
		text: Delete('customers', 'customer_id', 'customer_id'),
		values: [customerId],
	})

const validateResult = (result: QueryResult<QueryResultRow>): ResponseData => {
	if (result.rows.length === 0)
		return {
			status: NOT_FOUND,
			data: 'Route does not exit',
		}
	const validData = CustomerDBResultSchema.validate(result.rows[0])
	if (validData.error)
		throw new BadRequestError('Invalid Data Schema: ' + validData.error.message)
	return {
		data: validData.value,
	}
}

// Saves from a nasty bugs
const processPostRoute = <ProcessRouteWithoutBody>processRoute
const createCustomerAccount = processPostRoute(
	createQuery,
	CREATED,
	validateResult
)

const processGetRoute = <ProcessRouteWithoutBody>processRoute
const getCustomerAccount = processGetRoute(readQuery, OK, validateResult)

const processDeleteRoute = <ProcessRouteWithoutBodyAndDBResult>processRoute
const deleteCustomerAccount = processDeleteRoute(deleteQuery, NO_CONTENT)

export { createCustomerAccount, getCustomerAccount, deleteCustomerAccount }
