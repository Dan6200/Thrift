import { StatusCodes } from 'http-status-codes'
import {
  ProcessRouteWithoutBody,
  QueryParams,
} from '../../../types-and-interfaces/process-routes.js'
import createRouteProcessor from '../../routes/process.js'
import { knex } from '../../../db/index.js'
import { isSuccessful } from '../../utils/query-validation.js'
import { VendorSchemaID } from '../../../app-schema/vendors.js'

const { CREATED, OK } = StatusCodes

/**
 * @description Add a vendor account to the database
 **/
const createQuery = async <T>({
  uid: vendorId,
}: QueryParams<T>): Promise<typeof vendorId> =>
  knex('vendors').insert({ vendor_id: vendorId }).returning('vendor_id')

/**
 * @description Delete the vendor account from the database
 **/
const deleteQuery = async <T>({
  uid: vendorId,
}: QueryParams<T>): Promise<typeof vendorId> =>
  knex('vendors').where('vendor_id', vendorId).del().returning('vendor_id')

const processPostRoute = <ProcessRouteWithoutBody>createRouteProcessor
const processDeleteRoute = <ProcessRouteWithoutBody>createRouteProcessor

export const postVendor = processPostRoute({
  Query: createQuery,
  status: CREATED,
  validateResult: isSuccessful(VendorSchemaID),
})

export const deleteVendor = processDeleteRoute({
  Query: deleteQuery,
  status: OK,
  validateResult: isSuccessful(VendorSchemaID),
})
