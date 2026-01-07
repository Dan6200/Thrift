// packages/thrift-api/server/src/app-schema/payments.ts
import Joi from 'joi'

// --- Request Schemas ---

// Schema for initializing a payment
export const InitializePaymentRequestSchema = Joi.object({
  params: Joi.object().optional(), // No path params for /initialize
  body: Joi.object({
    order_id: Joi.number().integer().positive().required(),
    // amount: Joi.number().positive().required(), // Amount will be derived from order_id for security
    // email: Joi.string().email().required(), // Email will be derived from authenticated user for security
    callback_url: Joi.string().uri().optional(), // Optional: Frontend can specify redirect URL
  }).required(),
  query: Joi.object({
    save_card: Joi.boolean().optional(),
  }).optional(),
})

// Schema for Paystack webhook payload
export const PaystackWebhookRequestSchema = Joi.object({
  event: Joi.string().required(), // e.g., 'charge.success'
  data: Joi.object().required(), // The actual transaction data
}).unknown(true) // Allow unknown keys as webhook payloads can be extensive

// --- Response Schemas ---

// Schema for the response after initializing a payment with Paystack
export const InitializePaymentResponseSchema = Joi.object({
  authorization_url: Joi.string().uri().required(), // Paystack's redirect URL
  access_code: Joi.string().optional(), // Paystack's access code for pop-up widgets
  reference: Joi.string().required(), // Paystack's unique transaction reference
})

export const PaystackWebhookResponseSchema = Joi.object({
  message: Joi.string().required(),
  order: Joi.object().optional(), // Webhook might return updated order details
}).unknown(true) // Allow unknown keys if the order object is complex and not fully validated here
