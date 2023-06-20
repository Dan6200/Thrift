import { StatusCodes } from 'http-status-codes'
import db from '../../../db/index.js'
import {
	CRUDQueryAuth,
	ProcessRouteWithoutBody,
	ProcessRouteWithoutBodyAndDBResult,
} from '../../../types-and-interfaces/process-routes.js'
import { ResponseData } from '../../../types-and-interfaces/response.js'
import processRoute from '../../helpers/process-route.js'
const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes

const createQuery: CRUDQueryAuth = ({ userId: vendorId }) =>
	db.query(`insert into vendors values($1) returning vendor_id`, [vendorId])

const readQuery: CRUDQueryAuth = ({ userId: vendorId }) =>
	db.query(`select vendor_id from vendors`, [vendorId])

// NOTE: Never delete without where clause!!!
const deleteQuery: CRUDQueryAuth = ({ userId: vendorId }) =>
	db.query(`delete from vendors where vendor_id=$1`, [vendorId])

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

// Saves from a nasty bugs
const processPostRoute = <ProcessRouteWithoutBody>processRoute
const createVendorAccount = processPostRoute(
	createQuery,
	CREATED,
	undefined,
	validateResult
)

const processGetRoute = <ProcessRouteWithoutBody>processRoute
const getVendorAccount = processGetRoute(
	readQuery,
	OK,
	undefined,
	validateResult
)

const processDeleteRoute = <ProcessRouteWithoutBodyAndDBResult>processRoute
const deleteVendorAccount = processDeleteRoute(deleteQuery, NO_CONTENT)

export { createVendorAccount, getVendorAccount, deleteVendorAccount }
