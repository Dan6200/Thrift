import express from 'express'
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import { validate } from '../../request-validation.js'
import { validateDbResult } from '../../db-result-validation.js'
import { sendResponse } from '../../send-response.js'
import authenticateUser from '../../authentication.js'
import { createOrderHandler } from '#src/context/orders/http/create-order.js'
import { getAllOrdersHandler } from '#src/context/orders/http/get-all-orders.js'
import { getOrderHandler } from '#src/context/orders/http/get-order.js'
import { findReviewableItemHandler } from '#src/context/orders/http/find-reviewable-item.js'
import { amendOrderHandler } from '#src/context/orders/http/amend-order.js'
import { cancelOrderHandler } from '#src/context/orders/http/cancel-order.js'
import {
  CreateOrderRequestSchema,
  GetAllOrdersRequestSchema,
  GetOrderRequestSchema,
  FindReviewableItemRequestSchema,
  AmendOrderRequestSchema,
  CancelOrderRequestSchema,
  OrderResponseSchema,
  OrderGETAllResponseSchema,
} from '../../app-schema/orders/index.js'

const router = express.Router()
const { CREATED, OK } = StatusCodes

router
  .route('/')
  .post(
    authenticateUser,
    validate(CreateOrderRequestSchema),
    createOrderHandler,
    validateDbResult(OrderResponseSchema),
    sendResponse(CREATED),
  )
  .get(
    authenticateUser,
    validate(GetAllOrdersRequestSchema),
    getAllOrdersHandler,
    validateDbResult(OrderGETAllResponseSchema),
    sendResponse(OK),
  )

router.route('/reviewable-item').get(
  authenticateUser,
  validate(FindReviewableItemRequestSchema),
  findReviewableItemHandler,
  validateDbResult(
    Joi.object({
      order_item_id: Joi.number().integer().positive().required(),
    }),
  ),
  sendResponse(OK),
)

router
  .route('/:order_id')
  .get(
    authenticateUser,
    validate(GetOrderRequestSchema),
    getOrderHandler,
    validateDbResult(OrderResponseSchema),
    sendResponse(OK),
  )
  .patch(
    authenticateUser,
    validate(AmendOrderRequestSchema),
    amendOrderHandler,
    validateDbResult(OrderResponseSchema),
    sendResponse(OK),
  )

router.post(
  '/:order_id/cancel',
  authenticateUser,
  validate(CancelOrderRequestSchema),
  cancelOrderHandler,
  validateDbResult(OrderResponseSchema),
  sendResponse(OK),
)

export default router
