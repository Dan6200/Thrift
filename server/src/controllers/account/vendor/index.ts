import { StatusCodes } from 'http-status-codes'
import db from '../../../db/index.js'
import { ProcessRouteWithoutBody } from '../../../types-and-interfaces/process-routes.js'
import {
  InsertRecord,
  SelectRecord,
  DeleteRecord,
} from '../../helpers/generate-sql-commands/index.js'
import createProcessRoute from '../../routes/process.js'
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

const createProcessRouteWithoutBody = <ProcessRouteWithoutBody>(
  createProcessRoute
)

const createVendorAccount = createProcessRouteWithoutBody({
  Query: createQuery,
  status: CREATED,
  validateResult: isSuccessful,
})

const getVendorAccount = createProcessRouteWithoutBody({
  Query: readQuery,
  status: NO_CONTENT,
  validateResult: isSuccessful,
})

const deleteVendorAccount = createProcessRouteWithoutBody({
  Query: deleteQuery,
  status: NO_CONTENT,
  validateResult: isSuccessful,
})

export { createVendorAccount, getVendorAccount, deleteVendorAccount }
