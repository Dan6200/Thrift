import { StatusCodes } from 'http-status-codes'
import { QueryResult } from 'pg'
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
const { CREATED, NO_CONTENT, NOT_FOUND } = StatusCodes

const createQuery: CRUDQueryAuth = ({ user: { userId: vendorId } }) =>
	db.query({
		text: Insert('vendors', ['vendor_id'], 'vendor_id'),
		values: [vendorId],
	})

const readQuery: CRUDQueryAuth = ({ user: { userId: vendorId } }) =>
	db.query({
		text: Select('vendors', ['1'], 'vendor_id=$1'),
		values: [vendorId],
	})

const deleteQuery: CRUDQueryAuth = ({ user: { userId: vendorId } }) =>
	db.query({
		text: Delete('vendors', 'vendor_id', 'vendor_id=$1'),
		values: [vendorId],
	})

const validateResult = async (result: QueryResult): Promise<ResponseData> => {
	console.log('runs', import.meta.url)
	if (!result.rows.length) {
		return {
			status: NOT_FOUND,
			data: 'Vendor account does not exist. Please create a vendor account',
		}
	}
	return {
		data: {},
	}
}

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
	NO_CONTENT,
	undefined,
	validateResult
)

const processDeleteRoute = <ProcessRouteWithoutBodyAndDBResult>processRoute
const deleteVendorAccount = processDeleteRoute(
	deleteQuery,
	NO_CONTENT,
	undefined,
	undefined
)

export { createVendorAccount, getVendorAccount, deleteVendorAccount }
