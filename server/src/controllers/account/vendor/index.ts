import { StatusCodes } from 'http-status-codes'
import { QueryResult } from 'pg'
import db from '../../../db/index.js'
import { ProcessRouteWithoutBodyAndDBResult } from '../../../types-and-interfaces/process-routes.js'
import { ResponseData } from '../../../types-and-interfaces/response.js'
import {
  InsertRecord,
  SelectRecord,
  DeleteRecord,
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

const createQuery = async ({ userId: vendorId }) => {
  return db.query({
    text: InsertRecord('vendors', ['vendor_id'], 'vendor_id'),
    values: [vendorId],
  })
}

const readQuery = async ({ userId: vendorId }) => {
  return db.query({
    text: SelectRecord('vendors', ['1'], 'vendor_id=$1'),
    values: [vendorId],
  })
}

const deleteQuery = async ({ userId: vendorId }) => {
  return db.query({
    text: DeleteRecord('vendors', ['vendor_id'], 'vendor_id=$1'),
    values: [vendorId],
  })
}

const processPostRoute = <ProcessRouteWithoutBodyAndDBResult>processRoute
const createVendorAccount = processPostRoute({
  Query: createQuery,
  status: CREATED,
  validateBody: undefined,
  validateResult: undefined,
})

const processGetRoute = <ProcessRouteWithoutBodyAndDBResult>processRoute
const getVendorAccount = processGetRoute({
  Query: readQuery,
  status: NO_CONTENT,
  validateBody: undefined,
  validateResult: undefined,
})

const processDeleteRoute = <ProcessRouteWithoutBodyAndDBResult>processRoute
const deleteVendorAccount = processDeleteRoute({
  Query: deleteQuery,
  status: NO_CONTENT,
  validateBody: undefined,
  validateResult: undefined,
})

export { createVendorAccount, getVendorAccount, deleteVendorAccount }
