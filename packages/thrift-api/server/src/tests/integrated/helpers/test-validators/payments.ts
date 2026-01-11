// packages/thrift-api/server/src/tests/integrated/helpers/test-validators/payments.ts
import { validateTestData } from '../test-validators.js'
import {
  InitializePaymentRequestSchema,
  InitializePaymentResponseSchema,
  PaystackWebhookRequestSchema,
} from '#src/app-schema/payments.js'

export const validateInitializePaymentReq = (data: unknown) => {
  return validateTestData(
    InitializePaymentRequestSchema,
    data,
    'Initialize Payment Request Validation Error',
  )
}

export const validateInitializePaymentRes = (data: unknown) =>
  validateTestData(
    InitializePaymentResponseSchema,
    data,
    'Initialize Payment Response Validation Error',
  )

export const validatePaystackWebhookReq = (data: unknown) =>
  validateTestData(
    PaystackWebhookRequestSchema,
    data,
    'Paystack Webhook Request Validation Error',
  )
