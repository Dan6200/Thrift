import { StatusCodes } from 'http-status-codes'
import {
  ProcessRouteWithoutBody,
  QueryParams,
} from '../../../types-and-interfaces/process-routes.js'
import {
  InsertRecord,
  DeleteRecord,
} from '../../helpers/generate-sql-commands/index.js'
import processRoute from '../../helpers/process-route.js'
import db from '../../../db/index.js'
import { QueryResult, QueryResultRow } from 'pg'
import { isSuccessful } from '../../helpers/query-validation.js'

const { CREATED, NO_CONTENT } = StatusCodes

/**
 * @description Add a customer account to the database
 **/
const createQuery = async <T>({
  userId: customerId,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> =>
  db.query({
    text: InsertRecord('customers', ['customer_id'], 'customer_id'),
    values: [customerId],
  })

/**
 * @description Delete the customer account from the database
 **/
const deleteQuery = async <T>({
  userId: customerId,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> =>
  await db.query({
    text: DeleteRecord('customers', ['customer_id'], 'customer_id=$1'),
    values: [customerId],
  })

const processPostRoute = <ProcessRouteWithoutBody>processRoute
const processDeleteRoute = <ProcessRouteWithoutBody>processRoute

const createCustomerAccount = processPostRoute({
  Query: createQuery,
  status: CREATED,
  validateResult: isSuccessful,
})

const deleteCustomerAccount = processDeleteRoute({
  Query: deleteQuery,
  status: NO_CONTENT,
  validateResult: isSuccessful,
})

export { createCustomerAccount, deleteCustomerAccount }
