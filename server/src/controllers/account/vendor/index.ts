import { StatusCodes } from 'http-status-codes'
import { QueryResult } from 'pg'
import {
  CRUDQueryAuth,
  ProcessRouteWithoutBodyAndDBResult,
} from '../../../types-and-interfaces/process-routes.js'
import { ResponseData } from '../../../types-and-interfaces/response.js'
import db from '../../../db/pg/index.js'
import {
  InsertInTable,
  SelectFromTable,
  DeleteInTable,
} from '../../helpers/generate-sql-commands/index.js'
import processRoute from '../../helpers/process-route.js'

const { CREATED, NO_CONTENT, NOT_FOUND } = StatusCodes

const validateResult = async (result: QueryResult): Promise<ResponseData> => {
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

const createQuery: CRUDQueryAuth = async ({ user: { userId: vendorId } }) => {
  let result = await db.query({
    text: InsertInTable('vendors', ['vendor_id'], 'vendor_id'),
    values: [vendorId],
  })
  await validateResult(result)
}

const readQuery: CRUDQueryAuth = async ({ user: { userId: vendorId } }) => {
  let result = await db.query({
    text: SelectFromTable('vendors', ['1'], 'vendor_id=$1'),
    values: [vendorId],
  })
  await validateResult(result)
}

const deleteQuery: CRUDQueryAuth = async ({ user: { userId: vendorId } }) => {
  let result = await db.query({
    text: DeleteInTable('vendors', 'vendor_id', 'vendor_id=$1'),
    values: [vendorId],
  })
  await validateResult(result)
}

const processPostRoute = <ProcessRouteWithoutBodyAndDBResult>processRoute
const createVendorAccount = processPostRoute(
  createQuery,
  CREATED,
  undefined,
  undefined
)

const processGetRoute = <ProcessRouteWithoutBodyAndDBResult>processRoute
const getVendorAccount = processGetRoute(
  readQuery,
  NO_CONTENT,
  undefined,
  undefined
)

const processDeleteRoute = <ProcessRouteWithoutBodyAndDBResult>processRoute
const deleteVendorAccount = processDeleteRoute(
  deleteQuery,
  NO_CONTENT,
  undefined,
  undefined
)

export { createVendorAccount, getVendorAccount, deleteVendorAccount }
