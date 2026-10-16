import {
  CreateOrderRequestSchema,
  UpdateOrderRequestSchema,
  DeleteOrderRequestSchema,
  CancelOrderRequestSchema,
  GetOrderRequestSchema,
  GetAllOrdersRequestSchema,
  FindReviewableItemRequestSchema,
  OrderResponseSchema,
  OrderGETAllResponseSchema,
  FindReviewableItemResponseSchema, // Import the new response schema
} from '#src/app-schema/orders/index.js'
import { validateTestData } from '../test-validators.js'

export const validateCreateOrderReq = (data: unknown) =>
  validateTestData(
    CreateOrderRequestSchema,
    data,
    'Create Order Request Validation Error',
  )

export const validateUpdateOrderReq = (data: unknown) =>
  validateTestData(
    UpdateOrderRequestSchema,
    data,
    'Update Order Request Validation Error',
  )

export const validateDeleteOrderReq = (data: unknown) =>
  validateTestData(
    DeleteOrderRequestSchema,
    data,
    'Delete Order Request Validation Error',
  )

export const validateCancelOrderReq = (data: unknown) =>
  validateTestData(
    CancelOrderRequestSchema,
    data,
    'Cancel Order Request Validation Error',
  )

export const validateGetOrderReq = (data: unknown) =>
  validateTestData(
    GetOrderRequestSchema,
    data,
    'Get Order Request Validation Error',
  )

export const validateGetAllOrdersReq = (data: unknown) =>
  validateTestData(
    GetAllOrdersRequestSchema,
    data,
    'Get All Orders Request Validation Error',
  )

export const validateFindReviewableItemReq = (data: unknown) =>
  validateTestData(
    FindReviewableItemRequestSchema,
    data,
    'Find Reviewable Item Request Validation Error',
  )

export const validateOrderRes = (data: unknown) =>
  validateTestData(OrderResponseSchema, data, 'Order Response Validation Error')

export const validateGetAllOrdersRes = (data: unknown) =>
  validateTestData(
    OrderGETAllResponseSchema,
    data,
    'Get All Orders Response Validation Error',
  )

export const validateFindReviewableItemRes = (data: unknown) =>
  validateTestData(
    FindReviewableItemResponseSchema,
    data,
    'Find Reviewable Item Response Validation Error',
  )
