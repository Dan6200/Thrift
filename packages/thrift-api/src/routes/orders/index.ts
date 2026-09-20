import express from 'express'
import Joi from 'joi' // New import
import { StatusCodes } from 'http-status-codes'
import { validate } from '../../request-validation.js'
import { validateDbResult } from '../../db-result-validation.js'
import { sendResponse } from '../../send-response.js'
import authenticateUser from '../../authentication.js'
import {
  getAllOrdersLogic,
  getOrderLogic,
  findReviewableItemLogic,
} from '../../logic/orders/index.js'
import { createOrderHandler } from '#src/context/orders/http/create-order.js'
import {
  CreateOrderRequestSchema,
  GetAllOrdersRequestSchema,
  GetOrderRequestSchema,
  FindReviewableItemRequestSchema,
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
    getAllOrdersLogic,
    validateDbResult(OrderGETAllResponseSchema),
    sendResponse(OK),
  )

router.route('/reviewable-item').get(
  authenticateUser,
  validate(FindReviewableItemRequestSchema),
  findReviewableItemLogic,
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
    getOrderLogic,
    validateDbResult(OrderResponseSchema),
    sendResponse(OK),
  )

export default router
