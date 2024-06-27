import { StatusCodes } from 'http-status-codes'
import {
  ProcessRouteWithoutBody,
  QueryParams,
} from '../../../types-and-interfaces/process-routes.js'
import createRouteProcessor from '../../routes/process.js'
import { knex } from '../../../db/index.js'
import { QueryResult, QueryResultRow } from 'pg'
import { isSuccessful } from '../../utils/query-validation.js'

const { CREATED, NO_CONTENT } = StatusCodes

/**
 * @description Add a vendor account to the database
 **/
const createQuery = async <T>({
  userId: vendorId,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> =>
  knex('vendors').insert({ vendor_id: vendorId }).returning('vendor_id')

/**
 * @description Delete the vendor account from the database
 **/
const deleteQuery = async <T>({
  userId: vendorId,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> =>
  knex('vendors').where('vendor_id', vendorId).del().returning('vendor_id')

const processPostRoute = <ProcessRouteWithoutBody>createRouteProcessor
const processDeleteRoute = <ProcessRouteWithoutBody>createRouteProcessor

export const postVendor = processPostRoute({
  Query: createQuery,
  status: CREATED,
  validateResult: isSuccessful,
})

export const deleteVendor = processDeleteRoute({
  Query: deleteQuery,
  status: NO_CONTENT,
  validateResult: isSuccessful,
})
