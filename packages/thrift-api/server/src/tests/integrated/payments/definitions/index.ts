// packages/thrift-api/server/src/tests/integrated/payments/definitions/index.ts
import { StatusCodes } from 'http-status-codes'
import testRequest from '#src/tests/integrated/test-request/index.js'
import {
  TestRequest,
  RequestParams,
} from '#src/tests/integrated/test-request/types.js'
import {
  validateInitializePaymentReq,
  validateInitializePaymentRes,
  validatePaystackWebhookReq,
} from '../../helpers/test-validators/payments.js'

const { OK, BAD_REQUEST } = StatusCodes
const paymentsPathBase = '/v1/payments'

// Helper for POST /payments/initialize
export const testInitializePayment = (args: {
  token: string
  body: { order_id: number; callback_url?: string }
  expectedStatusCode?: number
}) => {
  const path = `${paymentsPathBase}/initialize`
  const requestParams: RequestParams = {
    token: args.token,
    body: args.body,
  }
  return (testRequest as TestRequest)({
    verb: 'post',
    statusCode: args.expectedStatusCode || OK,
    path,
    validateTestReqData:
      args.expectedStatusCode === BAD_REQUEST
        ? null
        : validateInitializePaymentReq,
    validateTestResData:
      args.expectedStatusCode === OK ? validateInitializePaymentRes : null,
  })(requestParams)
}

// Helper for POST /payments/webhook
export const testPaystackWebhook = (args: {
  body: any
  headers: { 'x-paystack-signature': string; 'Content-Type': string }
  expectedStatusCode?: number
}) => {
  const path = `${paymentsPathBase}/webhook`
  const requestParams: RequestParams = {
    body: args.body,
    headers: args.headers,
  }
  return (testRequest as TestRequest)({
    verb: 'post',
    statusCode: args.expectedStatusCode || OK,
    path,
    validateTestReqData: validatePaystackWebhookReq,
    validateTestResData: null, // Webhook response is usually just a status, not a complex schema
  })(requestParams)
}
