import { StatusCodes } from 'http-status-codes'
import { QueryResult } from 'pg'
import db from '../../../db/index.js'
import {
	CRUDQueryAuth,
	ProcessRouteWithoutBody,
	ProcessRouteWithoutBodyAndDBResult,
} from '../../../types-and-interfaces/process-routes.js'
import { ResponseData } from '../../../types-and-interfaces/response.js'
import processRoute from '../../helpers/process-route.js'
const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes

const createQuery: CRUDQueryAuth = ({ userId: customerId }) =>
	db.query(`insert into customers values($1) returning customer_id`, [
		customerId,
	])

const readQuery: CRUDQueryAuth = ({ userId: customerId }) =>
	db.query(`select customer_id from customers where customer_id=$1`, [
		customerId,
	])

// NOTE: Never delete without where clause!!!
const deleteQuery: CRUDQueryAuth = ({ userId: customerId }) =>
	db.query(`delete from customers where customer_id=$1`, [customerId])

const validateResult = (data: QueryResult<any>): ResponseData => {
	if (data === undefined)
		return {
			status: NOT_FOUND,
			data: 'Route does not exit',
		}
	return {
		data,
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

const processDeleteRoute = <ProcessRouteWithoutBodyAndDBResult>processRoute
const deleteCustomerAccount = processDeleteRoute(deleteQuery, NO_CONTENT)

export { createCustomerAccount, getCustomerAccount, deleteCustomerAccount }
