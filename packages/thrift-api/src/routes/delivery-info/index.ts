import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { validate } from '../../request-validation.js'
import { validateDbResult } from '../../db-result-validation.js'
import { sendResponse } from '../../send-response.js'
import authenticateUser from '../../authentication.js'
import { customerAuthorization } from '../../authorization/customer-authorization.js'
import { createDeliveryHandler } from '#src/context/fulfillment/http/create-delivery.js'
import { getAllDeliveriesHandler } from '#src/context/fulfillment/http/get-all-deliveries.js'
import { getDeliveryHandler } from '#src/context/fulfillment/http/get-delivery.js'
import { updateDeliveryHandler } from '#src/context/fulfillment/http/update-delivery.js'
import { deleteDeliveryHandler } from '#src/context/fulfillment/http/delete-delivery.js'
import {
  DeliveryInfoCreateRequestSchema,
  DeliveryInfoGetRequestSchema,
  DeliveryInfoUpdateRequestSchema,
  DeliveryInfoDeleteRequestSchema,
  DeliveryInfoResponseListSchema,
  DeliveryInfoResponseSchema,
} from '../../app-schema/delivery-info.js'
import { checkDeliveryLimitLogic } from '../../authorization/check-delivery-limit.js'

const router = express.Router()
const { CREATED, OK, NO_CONTENT } = StatusCodes

router
  .route('/')
  .post(
    authenticateUser,
    customerAuthorization,
    checkDeliveryLimitLogic,
    validate(DeliveryInfoCreateRequestSchema),
    createDeliveryHandler,
    validateDbResult(DeliveryInfoResponseSchema),
    sendResponse(CREATED),
  )
  .get(
    authenticateUser,
    customerAuthorization,
    getAllDeliveriesHandler,
    validateDbResult(DeliveryInfoResponseListSchema),
    sendResponse(OK),
  )

router
  .route('/:deliveryInfoId')
  .get(
    authenticateUser,
    customerAuthorization,
    validate(DeliveryInfoGetRequestSchema),
    getDeliveryHandler,
    validateDbResult(DeliveryInfoResponseSchema),
    sendResponse(OK),
  )
  .patch(
    authenticateUser,
    customerAuthorization,
    validate(DeliveryInfoUpdateRequestSchema),
    updateDeliveryHandler,
    validateDbResult(DeliveryInfoResponseSchema),
    sendResponse(OK),
  )
  .delete(
    authenticateUser,
    customerAuthorization,
    validate(DeliveryInfoDeleteRequestSchema),
    deleteDeliveryHandler,
    sendResponse(NO_CONTENT),
  )

export default router
