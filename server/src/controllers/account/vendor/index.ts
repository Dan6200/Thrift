import { StatusCodes } from 'http-status-codes'
import db from '../../../db/index.js'
import { ProcessRouteWithoutBody } from '../../../types-and-interfaces/process-routes.js'
import {
  InsertRecord,
  SelectRecord,
  DeleteRecord,
} from '../../helpers/generate-sql-commands/index.js'
import processRoute from '../../helpers/process-route.js'
import { isSuccessful } from '../../helpers/query-validation.js'

const { CREATED, NO_CONTENT } = StatusCodes

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

const processPostRoute = <ProcessRouteWithoutBody>processRoute
const createVendorAccount = processPostRoute({
  Query: createQuery,
  status: CREATED,
  validateBody: undefined,
  validateResult: isSuccessful,
})

const processGetRoute = <ProcessRouteWithoutBody>processRoute
const getVendorAccount = processGetRoute({
  Query: readQuery,
  status: NO_CONTENT,
  validateBody: undefined,
  validateResult: isSuccessful,
})

const processDeleteRoute = <ProcessRouteWithoutBody>processRoute
const deleteVendorAccount = processDeleteRoute({
  Query: deleteQuery,
  status: NO_CONTENT,
  validateBody: undefined,
  validateResult: isSuccessful,
})

export { createVendorAccount, getVendorAccount, deleteVendorAccount }
