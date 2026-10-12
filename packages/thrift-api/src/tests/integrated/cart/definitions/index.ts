import { StatusCodes } from 'http-status-codes'
import testRequest from '../../test-request/index.js'
import { TestRequest, RequestParams } from '../../test-request/types.js'
import {
  validateAddItemToCartReq,
  validateUpdateCartItemReq,
  validateRemoveCartItemReq,
  validateGetCartReq,
  validateCartRes,
  validateCartItemRes,
} from '../../helpers/test-validators/cart.js'
import {
  CartResponseData,
  CartItem,
  CartItemRequestData,
} from '#src/types/cart.js'
import chai from 'chai'
import * as JDP from 'jsondiffpatch'
import * as consoleFormatter from 'jsondiffpatch/formatters/console'
import { assertRecentIsoTimestamp } from '../../helpers/assert-timestamp.js'

const jdp = JDP.create()

const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes

const cartPathBase = '/v1/cart'
const buildCartItemPath = (itemId: number) => `${cartPathBase}/items/${itemId}`

type ExpectedData = Omit<CartResponseData, 'customer_id' | 'cart_id'>

const compareCartItem = (actual: any, expected: any) => {
  const actualItem = actual as CartItem
  try {
    actualItem.variant_id.should.equal(expected.variant_id)
    actualItem.quantity.should.equal(expected.quantity)
    return true
  } catch (assertionError) {
    const delta = jdp.diff(expected, actualItem)
    if (delta) {
      console.log('Cart Item data comparison failed. Delta:')
      consoleFormatter.log(delta)
    }
    throw assertionError
  }
}

const sortActualExpect = (actual: any, expected: any) => {
  if (!expected.items.length || !actual.items.length)
    return { sortedActualCart: actual, sortedExpected: expected }
  const truncCount = Math.min(actual.items.length, expected.items.length)
  const actualItemsTrunc = actual.items.slice(0, truncCount)
  const expectedItemsTrunc = expected.items.slice(0, truncCount)
  const actualItemsExtras = actual.items.slice(truncCount)
  const expectedItemsExtras = expected.items.slice(truncCount)
  const sortedActualItemsTrunc = sortItems(actualItemsTrunc)
  const sortedExpectedItemsTrunc = sortItems(expectedItemsTrunc)
  const sortedActualItems = sortedActualItemsTrunc.concat(actualItemsExtras)
  const sortedExpectedItems =
    sortedExpectedItemsTrunc.concat(expectedItemsExtras)
  return {
    sortedActualCart: { ...actual, items: [...sortedActualItems] },
    sortedExpected: { ...expected, items: [...sortedExpectedItems] },
  }
}

const sortItems = (items: any) => {
  if (!items.length) return items
  const sortedCartItems = [...items].sort((a, b) => a.variant_id - b.variant_id)
  return sortedCartItems
}

const compareCartData = (actual: any, expected: ExpectedData) => {
  const actualCart = actual as CartResponseData
  const { sortedActualCart, sortedExpected } = sortActualExpect(
    actualCart,
    expected as any,
  )
  try {
    // Check that timestamps are parseable ISO strings within a generous window
    assertRecentIsoTimestamp(actualCart.created_at, { label: 'created_at' })
    assertRecentIsoTimestamp(actualCart.updated_at, { label: 'updated_at' })

    actualCart.total_items.should.equal(expected.total_items)
    actualCart.total_price.should.equal(expected.total_price)

    if (expected.items) {
      actualCart.items!.length.should.equal(expected.items.length)
      for (let i = 0; i < expected.items.length; i++) {
        const actualItem = actualCart.items![i]
        const expectedItem = expected.items[i]
        actualItem.variant_id.should.equal(expectedItem.variant_id)
        actualItem.quantity.should.equal(expectedItem.quantity)
      }
    }
  } catch (assertionError) {
    const delta = jdp.diff(sortedExpected, sortedActualCart)
    if (delta) {
      console.log('Cart data comparison failed. Delta:')
      consoleFormatter.log(delta)
    }
    throw assertionError
  }

  return true
}

export const testGetCart = (args: {
  token: string
  expectedData: Omit<CartResponseData, 'cart_id' | 'customer_id'>
}) => {
  const requestParams: RequestParams = {
    token: args.token,
  }
  return (testRequest as TestRequest)({
    statusCode: OK,
    verb: 'get',
    path: cartPathBase,
    validateTestReqData: validateGetCartReq,
    validateTestResData: validateCartRes,
    compareData: (actual, expected) =>
      compareCartData(actual, expected as ExpectedData),
    expectedData: args.expectedData,
  })(requestParams)
}

export const testAddItemToCart = (args: {
  token: string
  body: any
  expectedData: CartItemRequestData & { price: number }
}) => {
  const requestParams: RequestParams = {
    token: args.token,
    body: args.body,
  }
  return (testRequest as TestRequest)({
    verb: 'post',
    statusCode: CREATED,
    path: `${cartPathBase}/items`,
    validateTestReqData: validateAddItemToCartReq,
    validateTestResData: validateCartItemRes,
    compareData: (actual, expected) => compareCartItem(actual, expected),
    expectedData: args.expectedData,
  })(requestParams)
}

export const testUpdateCartItem = (args: {
  token: string
  params: { itemId: number }
  body: any
  expectedData: CartItemRequestData | { product_title: string }
}) => {
  const path = buildCartItemPath(args.params.itemId)
  const requestParams: RequestParams = {
    token: args.token,
    body: args.body,
    params: args.params,
  }
  return (testRequest as TestRequest)({
    statusCode: OK,
    verb: 'put',
    path,
    validateTestReqData: validateUpdateCartItemReq,
    validateTestResData: validateCartItemRes,
    compareData: (actual, expected) => compareCartItem(actual, expected),
    expectedData: args.expectedData,
  })(requestParams)
}

export const testRemoveCartItem = (args: {
  token: string
  params: { itemId: number }
}) => {
  const path = buildCartItemPath(args.params.itemId)
  const requestParams: RequestParams = {
    token: args.token,
    params: args.params,
  }
  return (testRequest as TestRequest)({
    statusCode: NO_CONTENT,
    verb: 'delete',
    path,
    validateTestReqData: validateRemoveCartItemReq,
    validateTestResData: null,
  })(requestParams)
}

export const testGetNonExistentCart = (args: { token: string }) => {
  const requestParams: RequestParams = {
    token: args.token,
  }
  return (testRequest as TestRequest)({
    verb: 'get',
    statusCode: NOT_FOUND,
    path: cartPathBase,
    validateTestReqData: validateGetCartReq,
    validateTestResData: null,
  })(requestParams)
}
