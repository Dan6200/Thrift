/**
import { StatusCodes } from 'http-status-codes'
import { QueryResult, QueryResultRow } from 'pg'
import {
  ShippingInfoSchemaReq,
  ShippingInfoSchemaDBList,
  ShippingInfoSchemaID,
  ShippingInfoSchemaDB,
} from '../../app-schema/shipping.js'
import db from '../../db/index.js'
import BadRequestError from '../../errors/bad-request.js'
import UnauthorizedError from '../../errors/unauthorized.js'
import {
  ProcessRoute,
  ProcessRouteWithoutBody,
  QueryParams,
} from '../../types-and-interfaces/process-routes.js'
import ShippingInfo, {
  isValidShippingInfo,
} from '../../types-and-interfaces/shipping-info.js'
import processRoute from '../routes/process.js'
import { validateReqData, validateResData } from '../utils/query-validation.js'

 * @param {QueryParams} qp
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Create a new shipping info for a customer
 * Checks:
 * 1. If the customer exists
 * 2. If the customer already has 5 shipping addresses

const createQuery = async <T>({
  body,
  userId: customerId,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> => {
  if (!customerId) throw new UnauthorizedError('Cannot access resource')
  // check if customer account exists
  const dbRes = await db.query({
    text: SelectRecord('customers', ['1'], 'customer_id=$1'),
    values: [customerId],
  })
  if (dbRes.rows.length === 0)
    throw new BadRequestError(
      'No Customer account found. Please create a Customer account'
    )
  // Limit the amount of shipping addresses a user can have:
  const LIMIT = 5
  const count: number = (
    await db.query({
      text: SelectRecord('shipping_info', ['1'], 'customer_id=$1'),
      values: [customerId],
    })
  ).rows.length
  if (count > LIMIT)
    throw new BadRequestError(`Cannot have more than ${LIMIT} stores`)

  if (!isValidShippingInfo(body))
    throw new BadRequestError('Invalid shipping info')
  const shippingData: ShippingInfo = body
  if (!shippingData) throw new BadRequestError('No data sent in request body')
  const DBFriendlyData = {
    ...shippingData,
    delivery_instructions: JSON.stringify(shippingData.delivery_instructions),
  }
  return db.query({
    text: InsertRecord(
      'shipping_info',
      ['customer_id', ...Object.keys(DBFriendlyData)],
      'shipping_info_id'
    ),
    values: [customerId, ...Object.values(DBFriendlyData)],
  })
}


 * @param {QueryParams} qp
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieves all the shipping info for a customer
 * Checks:
 * 1. If the customer account exists


const getAllQuery = async <T>({
  userId: customerId,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> => {
  if (!customerId) throw new UnauthorizedError('Cannot access resource')
  const res = await db.query({
    text: SelectRecord('customers', ['1'], 'customer_id=$1'),
    values: [customerId],
  })
  if (res.rows.length === 0)
    throw new BadRequestError(
      'No Customer account found. Please create a Customer account'
    )
  return db.query({
    text: SelectRecord('shipping_info', ['*'], 'customer_id=$1'),
    values: [customerId],
  })
}


 * @param {QueryParams} qp
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieves a single shipping info for a customer
 * Checks:
 * 1. If the customer account exists


const getQuery = async <T>({
  params,
  userId: customerId,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> => {
  if (params == null) throw new BadRequestError('No route parameters provided')
  const { shippingInfoId } = params
  if (!customerId) throw new UnauthorizedError('Cannot access resource')
  const res = await db.query({
    text: SelectRecord('customers', ['1'], 'customer_id=$1'),
    values: [customerId],
  })
  if (res.rows.length === 0)
    throw new BadRequestError(
      'No Customer account found. Please create a Customer account'
    )
  return db.query({
    text: SelectRecord('shipping_info', ['*'], `shipping_info_id=$1`),
    values: [shippingInfoId],
  })
}


 * @param {QueryParams} qp
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Updates shipping info for the customer
 * Checks:
 * 1. If the customer owns the shipping info
 * 2. If the shipping info ID is provided
 * 3. If the customer exists
 
const updateQuery = async <T>({
  params,
  body,
  userId: customerId,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> => {
  if (params == null) throw new BadRequestError('No route parameters provided')
  const { shippingInfoId } = params
  if (!isValidShippingInfo(body)) throw new BadRequestError('Invalid data')
  const shippingData = body
  if (!shippingInfoId) throw new BadRequestError('Need ID to update resource')
  if (!customerId) throw new UnauthorizedError('Cannot access resource')
  const res = await db.query({
    text: SelectRecord('customers', ['1'], 'customer_id=$1'),
    values: [customerId],
  })
  if (res.rows.length === 0)
    throw new BadRequestError(
      'No Customer account found. Please create a Customer account'
    )
  const DBFriendlyData = {
    ...shippingData,
    delivery_instructions: JSON.stringify(shippingData.delivery_instructions),
  }
  let fields = Object.keys(DBFriendlyData),
    data = Object.values(DBFriendlyData)
  const condition = `shipping_info_id=$1`
  const query = {
    text: UpdateRecord('shipping_info', fields, 2, condition, [
      'shipping_info_id',
    ]),
    values: [shippingInfoId, ...data],
  }
  return db.query(query)
}

 * @param {QueryParams} qp
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Deletes a shipping info for the customer
 * Checks:
 * 1. If Id is provided
 * 2. If Customer account exists
 * 3. If Customer owns the shipping info
 
const deleteQuery = async <T>({
  params,
  userId: customerId,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> => {
  if (params == null) throw new BadRequestError('No route parameters provided')
  const { shippingInfoId } = params
  if (!shippingInfoId)
    throw new BadRequestError('Need Id param to delete resource')
  if (!customerId) throw new UnauthorizedError('Cannot access resource')
  const res = await db.query({
    text: SelectRecord('customers', ['1'], 'customer_id=$1'),
    values: [customerId],
  })
  if (res.rows.length === 0)
    throw new BadRequestError(
      'No Customer account found. Please create a Customer account'
    )
  return db.query({
    text: DeleteRecord(
      'shipping_info',
      ['shipping_info_id'],
      'shipping_info_id=$1'
    ),
    values: [shippingInfoId],
  })
}

const { CREATED, OK } = StatusCodes

const processPostRoute = <ProcessRoute>processRoute
const createShippingInfo = processPostRoute({
  Query: createQuery,
  status: CREATED,
  validateBody: validateReqData(ShippingInfoSchemaReq),
  validateResult: validateResData(ShippingInfoSchemaID),
})

const processGetAllRoute = <ProcessRouteWithoutBody>processRoute
const getAllShippingInfo = processGetAllRoute({
  Query: getAllQuery,
  status: OK,
  validateResult: validateResData(ShippingInfoSchemaDBList),
})

const processGetIDRoute = <ProcessRouteWithoutBody>processRoute
const getShippingInfo = processGetIDRoute({
  Query: getQuery,
  status: OK,
  validateResult: validateResData(ShippingInfoSchemaDB),
})

const processPutRoute = <ProcessRoute>processRoute
const updateShippingInfo = processPutRoute({
  Query: updateQuery,
  status: OK,
  validateBody: validateReqData(ShippingInfoSchemaReq),
  validateResult: validateResData(ShippingInfoSchemaID),
})

const processDeleteRoute = <ProcessRouteWithoutBody>processRoute
const deleteShippingInfo = processDeleteRoute({
  Query: deleteQuery,
  status: OK,
  validateResult: validateResData(ShippingInfoSchemaID),
})

export {
  createShippingInfo,
  getShippingInfo,
  getAllShippingInfo,
  updateShippingInfo,
  deleteShippingInfo,
}
 **/
