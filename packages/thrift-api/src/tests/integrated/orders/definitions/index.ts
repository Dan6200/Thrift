import { StatusCodes } from 'http-status-codes'
import testRequest from '#src/tests/integrated/test-request/index.js'
import {
  TestRequest,
  RequestParams,
} from '#src/tests/integrated/test-request/types.js'
import {
  validateCreateOrderReq,
  validateUpdateOrderReq,
  validateDeleteOrderReq,
  validateCancelOrderReq,
  validateGetOrderReq,
  validateGetAllOrdersReq,
  validateOrderRes,
  validateGetAllOrdersRes,
  validateFindReviewableItemReq, // Import the new request validator
  validateFindReviewableItemRes, // Import the new response validator
} from '#src/tests/integrated/helpers/test-validators/orders.js'
import { OrderCreateRequestData, OrderResponseData } from '#src/types/orders.js'
import { FindReviewableItemRequestSchema } from '#src/app-schema/orders/index.js' // Correct import from app-schema
import chai from 'chai'
import * as JDP from 'jsondiffpatch'
import * as consoleFormatter from 'jsondiffpatch/formatters/console'

const jdp = JDP.create()

const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes

const ordersPathBase = '/v1/orders'
const buildOrderPath = (order_id: number) => `${ordersPathBase}/${order_id}`
const reviewableItemPath = `${ordersPathBase}/reviewable-item`

const compareOrderData = (actual: any, expected: any) => {
  const actualOrder = actual as OrderResponseData

  try {
    actualOrder.store_id.should.equal(expected.store_id)
    actualOrder.total_amount.should.equal(expected.total_amount)
    actualOrder.items.length.should.equal(expected.items.length)

    // Sort items by variant_id for consistent comparison
    const sortedActualItems = [...actualOrder.items].sort(
      (a, b) => a.variant_id - b.variant_id,
    )
    const sortedExpectedItems = [...expected.items].sort(
      (a, b) => a.variant_id - b.variant_id,
    )

    for (let i = 0; i < sortedExpectedItems.length; i++) {
      const actualItem = sortedActualItems[i]
      const expectedItem = sortedExpectedItems[i]
      actualItem.variant_id.should.equal(expectedItem.variant_id)
      actualItem.quantity.should.equal(expectedItem.quantity)
    }
  } catch (assertionError) {
    const delta = jdp.diff(expected, actual)
    if (delta) {
      console.log('Order data comparison failed. Delta:')
      consoleFormatter.log(delta)
    }
    throw assertionError
  }

  return true
}

export const testCreateOrder = (args: {
  token: string
  body: OrderCreateRequestData
  query: { store_id: number }
  expectedData: any
}) => {
  const requestParams: RequestParams = {
    token: args.token,
    body: args.body,
    query: args.query,
  }
  return (testRequest as TestRequest)({
    verb: 'post',
    statusCode: CREATED,
    path: ordersPathBase,
    validateTestReqData: validateCreateOrderReq,
    validateTestResData: validateOrderRes,
    compareData: (actual, expected) => compareOrderData(actual, expected),
    expectedData: args.expectedData,
  })(requestParams)
}

export const testGetAllOrders = (args: {
  token: string
  query: { store_id: number }
}) => {
  const requestParams: RequestParams = {
    token: args.token,
    query: args.query,
  }
  return (testRequest as TestRequest)({
    verb: 'get',
    statusCode: OK,
    path: ordersPathBase,
    validateTestReqData: validateGetAllOrdersReq,
    validateTestResData: validateGetAllOrdersRes,
  })(requestParams)
}

export const testGetOrder = (args: {
  token: string
  params: { order_id: number }
  query: { store_id: number }
}) => {
  const path = buildOrderPath(args.params.order_id)
  const requestParams: RequestParams = {
    token: args.token,
    params: args.params,
    query: args.query,
  }
  return (testRequest as TestRequest)({
    verb: 'get',
    statusCode: OK,
    path,
    validateTestReqData: validateGetOrderReq,
    validateTestResData: validateOrderRes,
  })(requestParams)
}

// New helper function for /reviewable-item
export const testGetReviewableItem = (args: {
  token: string
  query: { product_id: string } // Updated to product_id only
  expectedOrderItemId: number
}) => {
  const requestParams: RequestParams = {
    token: args.token,
    query: args.query,
  }
  return (testRequest as TestRequest)({
    verb: 'get',
    statusCode: OK,
    path: reviewableItemPath,
    validateTestReqData: validateFindReviewableItemReq,
    validateTestResData: validateFindReviewableItemRes, // Use the new response validator
    expectedData: { order_item_id: args.expectedOrderItemId },
    compareData: (actual: any, expected: any) => {
      chai.expect(actual.order_item_id).to.equal(expected.order_item_id)
      return true
    },
  })(requestParams)
}

export const testUpdateOrder = (args: {
  token: string
  params: { order_id: number }
  body: OrderCreateRequestData
  expectedData: any
}) => {
  const path = buildOrderPath(args.params.order_id)
  const requestParams: RequestParams = {
    token: args.token,
    params: args.params,
    body: args.body,
  }
  return (testRequest as TestRequest)({
    verb: 'patch',
    statusCode: OK,
    path,
    validateTestReqData: validateUpdateOrderReq,
    validateTestResData: validateOrderRes,
    compareData: (actual, expected) => compareOrderData(actual, expected),
    expectedData: args.expectedData,
  })(requestParams)
}

export const testCancelOrder = (args: {
  token: string
  params: { order_id: number }
}) => {
  const path = `${buildOrderPath(args.params.order_id)}/cancel`
  const requestParams: RequestParams = {
    token: args.token,
    params: args.params,
  }
  return (testRequest as TestRequest)({
    verb: 'post',
    statusCode: OK,
    path,
    validateTestReqData: validateCancelOrderReq,
    validateTestResData: validateOrderRes,
  })(requestParams)
}

export const testDeleteOrder = (args: {
  token: string
  params: { order_id: number }
}) => {
  const path = buildOrderPath(args.params.order_id)
  const requestParams: RequestParams = {
    token: args.token,
    params: args.params,
  }
  return (testRequest as TestRequest)({
    verb: 'delete',
    statusCode: NO_CONTENT,
    path,
    validateTestReqData: validateDeleteOrderReq,
    validateTestResData: null,
  })(requestParams)
}

export const testGetNonExistentOrder = (args: {
  token: string
  params: { order_id: number }
}) => {
  const path = buildOrderPath(args.params.order_id)
  const requestParams: RequestParams = {
    token: args.token,
    params: args.params,
  }
  return (testRequest as TestRequest)({
    verb: 'get',
    statusCode: NOT_FOUND,
    path,
    validateTestReqData: validateGetOrderReq,
    validateTestResData: null,
  })(requestParams)
}
