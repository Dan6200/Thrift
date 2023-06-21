import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { QueryResult } from 'pg'
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
const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes

const createQuery: CRUDQueryAuth = ({ userId: vendorId }) =>
	db.query(`insert into vendors values($1) returning vendor_id`, [vendorId])

const readQuery: CRUDQueryAuth = ({ userId: vendorId }) =>
	db.query(`select vendor_id from vendors`, [vendorId])

// NOTE: Never delete without where clause!!!
const deleteQuery: CRUDQueryAuth = ({ userId: vendorId }) =>
	db.query(Delete('vendor', 'vendor_id', 'vendor_id'), [vendorId])

const validateResult = (result: QueryResult): ResponseData => {
	if (!result.rows.length) {
		return {
			status: NOT_FOUND,
			data: 'Vendor account does not exist. Please create a vendor account',
		}
	}
	const validData = Joi.object({ vendor_id: Joi.string() }).validate(
		result.rows[0]
	)
	if (validData.error)
		throw new BadRequestError('Invalid Data Schema: ' + validData.error.message)
	return {
		data: validData.value,
	}
}

// Saves from a nasty bugs
const processPostRoute = <ProcessRouteWithoutBody>processRoute
const createVendorAccount = processPostRoute(
	createQuery,
	CREATED,
	validateResult
)

const processGetRoute = <ProcessRouteWithoutBody>processRoute
const getVendorAccount = processGetRoute(readQuery, OK, validateResult)

const processDeleteRoute = <ProcessRouteWithoutBodyAndDBResult>processRoute
const deleteVendorAccount = processDeleteRoute(deleteQuery, NO_CONTENT)

export { createVendorAccount, getVendorAccount, deleteVendorAccount }
