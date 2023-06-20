import { StatusCodes } from 'http-status-codes'
import db from '../../../db/index.js'
import { ResponseData } from '../../../types-and-interfaces/response.js'
import processRoute from '../../helpers/process-route.js'
const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes

const createQuery = ({ userId }) =>
	db.query(`insert into vendors values($1) returning vendor_id`, [userId])

const readQuery = ({ userId }) =>
	db.query(`select vendor_id from vendors`, [userId])

const deleteQuery = () => db.query(`delete from vendors`)

const validateResult = (data: any): ResponseData => {
	if (!data) {
		return {
			status: NOT_FOUND,
			data: 'Vendor account does not exist. Please create a vendor account',
		}
	}
	return {
		data,
	}
}

const createVendorAccount = processRoute(
	createQuery,
	CREATED,
	undefined,
	validateResult
)
const getVendorAccount = processRoute(readQuery, OK, undefined, validateResult)
const deleteVendorAccount = processRoute(deleteQuery, NO_CONTENT, undefined)

export { createVendorAccount, getVendorAccount, deleteVendorAccount }
