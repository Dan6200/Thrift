// packages/thrift-api/server/src/routes/payments.ts
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import authenticateUser from '#src/authentication.js'
import { validate } from '#src/request-validation.js'
import { sendResponse } from '#src/send-response.js'
import {
  initializePaymentLogic,
  handlePaystackWebhookLogic,
  processOrderJobLogic, // Import job logic
} from '#src/logic/payments/index.js'
import {
  InitializePaymentRequestSchema,
  InitializePaymentResponseSchema,
  PaystackWebhookRequestSchema,
  PaystackWebhookResponseSchema, // Import webhook response schema
} from '#src/app-schema/payments.js'
import { validateDbResult } from '#src/db-result-validation.js'
import { publishEvent } from '#src/events/publish.js'
import { PaymentSuccessEvent } from '#src/events/payment-success.js'

const router = Router()
const { OK } = StatusCodes

router.post(
  '/webhook',
  // Webhooks do NOT use authenticateUser middleware
  validate(PaystackWebhookRequestSchema), // Optional: Validate incoming webhook structure
  handlePaystackWebhookLogic,
  publishEvent(PaymentSuccessEvent), // Publish event to QStash
  validateDbResult(PaystackWebhookResponseSchema), // Validate our response
  sendResponse(OK),
)

// QStash Job Endpoint (Protected by Signature Verification inside logic)
router.post(
  '/jobs/process-order',
  processOrderJobLogic,
  validateDbResult(PaystackWebhookResponseSchema), // Reuse schema or create specific one
  sendResponse(OK),
)

router.use(authenticateUser) // subsequent routes require authentication

// Route to initialize a payment
router.post(
  '/initialize',
  validate(InitializePaymentRequestSchema),
  initializePaymentLogic,
  validateDbResult(InitializePaymentResponseSchema),
  sendResponse(OK),
)

export default router
