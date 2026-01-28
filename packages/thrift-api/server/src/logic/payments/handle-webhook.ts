// packages/thrift-api/server/src/logic/payments/handle-webhook.ts
import { NextFunction, Request, Response } from 'express'
import BadRequestError from '#src/errors/bad-request.js'
import InternalServerError from '#src/errors/internal-server.js'
import Paystack from '@paystack/paystack-sdk' // Paystack SDK
import crypto from 'crypto'

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY as string)

export const handlePaystackWebhookLogic = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  // 1. Verify Paystack Webhook Signature
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) {
    throw new InternalServerError('Paystack secret key not configured.')
  }

  const hash = crypto
    .createHmac('sha512', secret)
    .update(JSON.stringify(req.body))
    .digest('hex')

  if (hash !== req.headers['x-paystack-signature']) {
    throw new BadRequestError('Invalid Paystack webhook signature.')
  }

  // 2. Process Webhook Event
  const event = req.body

  if (event.event === 'charge.success') {
    const paystackReference = event.data.reference
    const orderId = event.data.metadata?.order_id // Retrieve order_id from metadata

    if (!orderId) {
      // This could be a webhook for an unrelated transaction or missing metadata
      console.warn(
        'Paystack webhook received with missing order_id metadata.',
        event,
      )
      req.dbResult = {
        message: 'Webhook processed (order_id missing/ignored).',
      }
      return next()
    }

    try {
      // 3. Verify Transaction with Paystack API (to prevent spoofing)
      const verification = await paystack.transaction.verify({
        reference: paystackReference,
      })

      if (!verification.status || verification.data.status !== 'success') {
        // Transaction is not truly successful according to Paystack's API
        throw new BadRequestError(
          `Paystack transaction verification failed for reference ${paystackReference}.`,
        )
      }

      // 4. Set Event Payload for the publishEvent middleware
      req.eventPayload = event.data

      console.log(
        `Webhook: Payment success received for order ${orderId}. Preparing to queue job...`,
      )
      req.dbResult = {
        message: 'Payment success received and processing initiated.',
      }
    } catch (error: any) {
      console.error(
        'Error processing Paystack webhook:',
        error.response?.data || error.message,
      )
      throw new InternalServerError(
        `Webhook processing failed: ${error.response?.data?.message || error.message}`,
      )
    }
  } else {
    // Handle other Paystack events (e.g., 'charge.failed', 'transfer.success', etc.)
    console.log(
      `Received Paystack event: ${event.event}. Not handling this event type currently.`,
    )
    req.dbResult = { message: `Event ${event.event} not handled.` }
  }

  next()
}
