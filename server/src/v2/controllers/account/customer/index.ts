import { StatusCodes } from 'http-status-codes'
import { ProcessRouteWithoutBody } from '../../../types-and-interfaces/process-routes.js'
import { ResponseData } from '../../../types-and-interfaces/response.js'
import {
  InsertInTable,
  DeleteInTable,
} from '../../helpers/generate-sql-commands/index.js'
import processRoute from '../../helpers/process-route.js'
import db from '../../../db/pg/index.js'
import BadRequestError from '../../../errors/bad-request.js'

const { CREATED, NO_CONTENT } = StatusCodes

/**
 * @param {Record<string, T>} result
 * @returns {Promise<ResponseData>}
 * @description Checks to see if query was successful
 * If the result is empty, throw an error
 * Otherwise, return an empty object
 * */
const isSuccessful = async <T>(
  result: Record<string, T>
): Promise<ResponseData> => {
  if (result === undefined || Object.keys(result).length === 0)
    throw new BadRequestError('Operation unsuccessful')
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

const processPostRoute = <ProcessRouteWithoutBody>processRoute
const createCustomerAccount = processPostRoute(
  createQuery,
  CREATED,
  undefined,
  isSuccessful
)

const processDeleteRoute = <ProcessRouteWithoutBody>processRoute
const deleteCustomerAccount = processDeleteRoute(
  deleteQuery,
  NO_CONTENT,
  undefined,
  isSuccessful
)

export { createCustomerAccount, deleteCustomerAccount }
