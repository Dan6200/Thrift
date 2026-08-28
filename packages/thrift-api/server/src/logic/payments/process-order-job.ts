import { NextFunction, Request, Response } from 'express'
import { knex } from '#src/db/index.js'
import InternalServerError from '#src/errors/internal-server.js'
import NotFoundError from '#src/errors/not-found.js'
import { Receiver } from '@upstash/qstash'
import logger from '#src/utils/logger.js'

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY || '',
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY || '',
})

export const processOrderJobLogic = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  // 1. Verify QStash Signature (Security)
  const signature = req.headers['upstash-signature'] as string
  const body = JSON.stringify(req.body)

  try {
    const isValid = await receiver.verify({
      signature,
      body,
    })

    if (!isValid) {
      logger.error('Invalid QStash signature')
      return next(new InternalServerError('Invalid job signature.'))
    }
  } catch (err) {
    logger.error('QStash verification error:', err)
    return next(new InternalServerError('Job verification failed.'))
  }

  // 2. Extract Data
  const { eventType, data } = req.body

  if (eventType !== 'charge.success') {
    req.dbResult = { message: `Event type ${eventType} ignored by processor.` }
    return next()
  }

  const paystackReference = data.reference
  const orderId = data.metadata?.order_id

  if (!orderId) {
    logger.warn('Job missing order_id metadata', data)
    req.dbResult = { message: 'order_id missing/ignored.' }
    return next()
  }

  try {
    /**
     * IDEMPOTENCY STRATEGY:
     * To ensure this job can safely run multiple times without duplicate side-effects (e.g., charging twice or sending duplicate emails):
     * 1. We only update orders currently in 'pending' status.
     * 2. If no rows are updated, we check if it's because the order was already processed by a previous run.
     */
    const [updatedOrder] = await knex('orders')
      .where({
        order_id: orderId,
        payment_reference: paystackReference,
        status: 'pending', // Only allow transition from pending
      })
      .update({
        status: 'processing',
        updated_at: knex.fn.now(),
      })
      .returning('*')

    if (!updatedOrder) {
      // Check if it failed because it was already processed
      const existingOrder = await knex('orders')
        .where({ order_id: orderId, payment_reference: paystackReference })
        .first()

      if (existingOrder && existingOrder.status !== 'pending') {
        logger.info(
          `Job Processor: Order ${orderId} already processed (Current Status: ${existingOrder.status}). Exiting gracefully.`,
        )
        req.dbResult = { message: 'Order already processed.' }
        return next()
      }

      throw new NotFoundError(
        `Order ${orderId} with reference ${paystackReference} not found or is in an invalid state.`,
      )
    }

    // 4. Save Card if requested
    const saveCard = data.metadata?.save_card
    const authorization = data.authorization

    if (saveCard && authorization && authorization.reusable) {
      const customerId = data.metadata?.customer_id
      const customerEmail = data.customer?.email

      await knex('payment_info')
        .insert({
          customer_id: customerId,
          authorization_code: authorization.authorization_code,
          email: customerEmail,
          last4: authorization.last4,
          exp_month: authorization.exp_month,
          exp_year: authorization.exp_year,
          brand: authorization.brand,
        })
        .onConflict('authorization_code')
        .ignore()

      logger.info(`Job Processor: Saved card for user ${customerId}`)
    }

    logger.info(`Job Processor: Order ${orderId} successfully processed.`)
    req.dbResult = {
      message: 'Order processed successfully',
      order: updatedOrder,
    }
    next()
  } catch (error: any) {
    logger.error('Error in processOrderJobLogic:', error.message)
    next(new InternalServerError(`Job processing failed: ${error.message}`))
  }
}
