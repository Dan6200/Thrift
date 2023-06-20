import { StatusCodes } from 'http-status-codes'
import db from '../../../db/index.js'
import { ResponseData } from '../../../types-and-interfaces/response.js'
import processRoute from '../../helpers/process-route.js'
const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes

const createQuery = ({ userId: customerId }) =>
	db.query(`insert into customers values($1) returning customer_id`, [
		customerId,
	])

const readQuery = ({ userId: customerId }) =>
	db.query(`select customer_id from customers where customer_id=$1`, [
		customerId,
	])

const deleteQuery = ({ userId: customerId }) =>
	db.query(`delete from customers where customer_id=$1`, [customerId])

const validateResult = (data: any): ResponseData => {
	if (data.rowCount === 0)
		return {
			status: NOT_FOUND,
			data: 'Route does not exit',
		}
	return {
		data,
	}
}

const createCustomerAccount = processRoute(createQuery, CREATED, validateResult)

const getCustomerAccount = processRoute(
	readQuery,
	OK,
	undefined,
	validateResult
)

const deleteCustomerAccount = processRoute(deleteQuery, NO_CONTENT, undefined)

export { createCustomerAccount, getCustomerAccount, deleteCustomerAccount }
