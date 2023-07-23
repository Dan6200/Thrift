import { StatusCodes } from 'http-status-codes'
import { ProcessRouteWithoutBodyAndDBResult } from '../../../types-and-interfaces/process-routes.js'
import { ResponseData } from '../../../types-and-interfaces/response.js'
import {
  InsertInTable,
  DeleteInTable,
} from '../../helpers/generate-sql-commands/index.js'
import processRoute from '../../helpers/process-route.js'
import db from '../../../db/pg/index.js'
import { RequestWithPayload } from '../../../types-and-interfaces/request.js'

const { CREATED, NOT_FOUND, NO_CONTENT } = StatusCodes

/**
 * @param {Record<string, T>} result
 * @returns {Promise<ResponseData>}
 * @description Validate the result of the query
 * If the result is empty, return a 404 status code
 * Otherwise, return an empty object
 * */
const validateResult = async <T>(
  result: Record<string, T>
): Promise<ResponseData> => {
  if (result === undefined || Object.keys(result).length === 0)
    return {
      status: NOT_FOUND,
      data: 'Route does not exit',
    }
  return {
    data: {},
  }
}
/**
 * @param {{userId: string}} {userId}
 * @returns {Promise<Record<string, T>>}
 * @description Add a customer account to the database
 **/
const createQuery = async <T>({
  userId: customerId,
}: {
  userId: string
}): Promise<Record<string, T>> => {
  return (
    await db.query({
      text: InsertInTable('customers', ['customer_id'], 'customer_id'),
      values: [customerId],
    })
  ).rows[0]
}

/**
 * @param {{userId: string}} {userId}
 * @returns {Promise<Record<string, T>>}
 * @description Delete the customer account from the database
 **/
const deleteQuery = async <T>({
  userId: customerId,
}: {
  userId: string
}): Promise<Record<string, T>> => {
  return (
    await db.query({
      text: DeleteInTable('customers', 'customer_id', 'customer_id=$1'),
      values: [customerId],
    })
  ).rows[0]
}

const processPostRoute = <ProcessRouteWithoutBodyAndDBResult>processRoute
const createCustomerAccount = processPostRoute(
  createQuery,
  CREATED,
  undefined,
  undefined
)

const processDeleteRoute = <ProcessRouteWithoutBodyAndDBResult>processRoute
const deleteCustomerAccount = processDeleteRoute(
  deleteQuery,
  NO_CONTENT,
  undefined,
  undefined
)

export { createCustomerAccount, deleteCustomerAccount }
