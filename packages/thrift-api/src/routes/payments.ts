import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import authenticateUser from '#src/authentication.js'
import { validate } from '#src/request-validation.js'
import { sendResponse } from '#src/send-response.js'
import { initializePaymentHandler } from '#src/context/payments/http/initialize-payment.js'
import { handleWebhookHandler } from '#src/context/payments/http/handle-webhook.js'
import { processOrderJobHandler } from '#src/context/payments/http/process-order-job.js'
import {
  InitializePaymentRequestSchema,
  InitializePaymentResponseSchema,
  PaystackWebhookRequestSchema,
  PaystackWebhookResponseSchema,
} from '#src/app-schema/payments.js'
import { validateDbResult } from '#src/db-result-validation.js'

const router = Router()
const { OK } = StatusCodes

router.post(
  '/webhook',
  validate(PaystackWebhookRequestSchema),
  handleWebhookHandler,
  validateDbResult(PaystackWebhookResponseSchema),
  sendResponse(OK),
)

router.post(
  '/jobs/process-order',
  processOrderJobHandler,
  validateDbResult(PaystackWebhookResponseSchema),
  sendResponse(OK),
)

router.use(authenticateUser)

router.post(
  '/initialize',
  validate(InitializePaymentRequestSchema),
  initializePaymentHandler,
  validateDbResult(InitializePaymentResponseSchema),
  sendResponse(OK),
)

export default router
