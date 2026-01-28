// packages/thrift-api/server/src/logic/payments/handle-webhook.ts
import { NextFunction, Request, Response } from 'express'
import BadRequestError from '#src/errors/bad-request.js'
import InternalServerError from '#src/errors/internal-server.js'
import Paystack from '@paystack/paystack-sdk' // Paystack SDK
import crypto from 'crypto'
import logger from '#src/utils/logger.js'

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
  const eventId = event.id // Paystack's unique event identifier

  if (!eventId) {
    logger.error('Paystack webhook missing event id.')
    throw new BadRequestError('Webhook missing event identifier.')
  }

  // 2.1 Replay Protection: Check if event already processed
  try {
    await knex('processed_webhooks').insert({
      event_id: eventId,
      provider: 'paystack',
      payload: event, // Optional: Store for audit trail
    })
  } catch (error: any) {
    if (error.code === '23505') {
      // Postgres unique violation (duplicate key)
      logger.info(`Webhook: Event ${eventId} already processed. Skipping.`)
      req.dbResult = { message: 'Event already processed.' }
      return next()
    }
    logger.error(`Failed to record webhook event ${eventId}:`, error.message)
    throw new InternalServerError('Failed to process webhook identity.')
  }

  if (event.event === 'charge.success') {
    const paystackReference = event.data.reference
    const orderId = event.data.metadata?.order_id // Retrieve order_id from metadata

    if (!orderId) {
      // This could be a webhook for an unrelated transaction or missing metadata
      logger.warn(
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

      logger.info(
        `Webhook: Payment success received for order ${orderId}. Preparing to queue job...`,
      )
      req.dbResult = {
        message: 'Payment success received and processing initiated.',
      }
    } catch (error: any) {
      logger.error(
        'Error processing Paystack webhook:',
        error.response?.data || error.message,
      )
      throw new InternalServerError(
        `Webhook processing failed: ${error.response?.data?.message || error.message}`,
      )
    }
  } else {
    // Handle other Paystack events (e.g., 'charge.failed', 'transfer.success', etc.)
    logger.info(
      `Received Paystack event: ${event.event}. Not handling this event type currently.`,
    )
    req.dbResult = { message: `Event ${event.event} not handled.` }
  }

  next()
}
