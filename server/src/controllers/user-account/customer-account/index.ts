import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { QueryResult, QueryResultRow } from 'pg'
import db from '../../../db/index.js'
import BadRequestError from '../../../errors/bad-request.js'
import {
	CRUDQueryAuth,
	ProcessRouteWithoutBody,
	ProcessRouteWithoutBodyAndDBResult,
} from '../../../types-and-interfaces/process-routes.js'
import { ResponseData } from '../../../types-and-interfaces/response.js'
import { Delete } from '../../helpers/generate-sql-commands/index.js'
import processRoute from '../../helpers/process-route.js'
import { CustomerDBResultSchema } from '../../../app-schema/customer/index.js'
const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes

const createQuery: CRUDQueryAuth = ({ userId: customerId }) =>
	db.query(`insert into customers values($1) returning customer_id`, [
		customerId,
	])

const readQuery: CRUDQueryAuth = ({ userId: customerId }) =>
	db.query(`select customer_id from customers where customer_id=$1`, [
		customerId,
	])

const deleteQuery: CRUDQueryAuth = ({ userId: customerId }) =>
	db.query(Delete('customers', 'customer_id', 'customer_id'), [customerId])

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
