// packages/thrift-api/server/src/routes/payments.ts
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import authenticateUser from '#src/authentication.js'
import { validate } from '#src/request-validation.js'
import { sendResponse } from '#src/send-response.js'
import {
  initializePaymentLogic,
  handlePaystackWebhookLogic, // Import the new webhook logic
} from '#src/logic/payments/index.js'
import {
  InitializePaymentRequestSchema,
  InitializePaymentResponseSchema,
  PaystackWebhookRequestSchema, // Schema for webhook validation
} from '#src/app-schema/payments.js'
import { validateDbResult } from '#src/db-result-validation.js'

const router = Router()
const { OK } = StatusCodes

router.post(
  '/webhook',
  // Webhooks do NOT use authenticateUser middleware, as the request comes from Paystack
  // Use a schema validator for the webhook payload if needed (PaystackWebhookRequestSchema)
  // Paystack webhook body structure is standard, so validation may be basic
  validate(PaystackWebhookRequestSchema),
  handlePaystackWebhookLogic,
  validateDbResult(InitializePaymentResponseSchema), // Add response validation
  sendResponse(OK),
)

router.use(authenticateUser) // Payments usually require authentication

// Route to initialize a payment
router.post(
  '/initialize',
  validate(InitializePaymentRequestSchema),
  initializePaymentLogic,
  validateDbResult(InitializePaymentResponseSchema),
  sendResponse(OK),
)

export default router
