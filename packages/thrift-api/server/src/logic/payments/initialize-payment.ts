// packages/thrift-api/server/src/logic/payments/initialize-payment.ts
import { NextFunction, Request, Response } from 'express'
import { knex } from '#src/db/index.js'
import BadRequestError from '#src/errors/bad-request.js'
import NotFoundError from '#src/errors/not-found.js'
import InternalServerError from '#src/errors/internal-server.js'
import UnauthenticatedError from '#src/errors/unauthenticated.js'
import Paystack from '@paystack/paystack-sdk' // Paystack SDK

// Initialize Paystack with secret key from environment variables
// This should ideally be done once at app startup
const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY as string)

export const initializePaymentLogic = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { userId } = req

  if (!userId) {
    throw new UnauthenticatedError(
      'Authentication required to initialize payment.',
    )
  }

  // validatedBody comes from InitializePaymentRequestSchema
  const { order_id, callback_url } = req.validatedBody

  if (!order_id) {
    throw new BadRequestError('Order ID cannot be NULL.')
  }

  const { save_card } = req.validatedQueryParams || {}

  // 1. Fetch order details to get amount and customer email
  const order = await knex('orders')
    .where({ order_id, customer_id: userId })
    .first()

  if (!order) {
    throw new NotFoundError(
      'Order not found or does not belong to the authenticated user.',
    )
  }

  // Ensure order is in a state ready for payment (e.g., 'pending')
  if (order.status !== 'pending') {
    throw new BadRequestError(
      `Order ${order_id} is not in a 'pending' state for payment.`,
    )
  }

  // Fetch customer email from profiles table
  const profile = await knex('profiles').where({ id: userId }).first('email')

  if (!profile || !profile.email) {
    throw new InternalServerError(
      'Customer email not found for authenticated user.',
    )
  }

  try {
    // 2. Initialize transaction with Paystack
    const transaction = await paystack.transaction.initialize({
      email: profile.email,
      amount: Math.round(order.total_amount * 100), // Amount in kobo/cents
      reference: `THR-${order.order_id}-${Date.now()}`, // Unique reference
      // Paystack metadata expects a JSON string
      metadata: JSON.stringify({
        order_id: order.order_id,
        customer_id: userId,
        save_card: !!save_card, // Pass intent to save card
        // Any other relevant data for your application
      }),
      callback_url:
        callback_url ||
        process.env.PAYSTACK_CALLBACK_URL ||
        'https://your-frontend.com/payment-success', // Optional callback URL
    })

    if (!transaction.status) {
      throw new InternalServerError(
        `Paystack initialization failed: ${transaction.message}`,
      )
    }

    // 3. Update the order with Paystack's transaction reference
    await knex('orders')
      .where({ order_id })
      .update({ payment_reference: transaction.data.reference }) // Assuming 'payment_reference' column exists in orders table

    // 4. Return authorization URL to frontend
    req.dbResult = {
      authorization_url: transaction.data.authorization_url,
      access_code: transaction.data.access_code,
      reference: transaction.data.reference,
    }
    next()
  } catch (error: any) {
    console.error(
      'Paystack initialization error:',
      error.response?.data || error.message,
    )
    throw new InternalServerError(
      `Payment initialization failed: ${error.response?.data?.message || error.message}`,
    )
  }
}
