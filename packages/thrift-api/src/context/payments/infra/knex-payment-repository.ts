import { knex } from '#src/db/index.js'
import InternalServerError from '#src/errors/internal-server.js'
import { PaymentRepository } from '../ports/payment-repository.js'

export const knexPaymentRepository: PaymentRepository = {
  async getOrderForPayment(orderId, customerId) {
    return knex('orders')
      .where({ order_id: orderId, customer_id: customerId })
      .first()
  },

  async getProfileEmail(userId) {
    const profile = await knex('profiles').where({ id: userId }).first('email')
    return profile?.email ?? null
  },

  async updatePaymentReference(orderId, reference) {
    await knex('orders')
      .where({ order_id: orderId })
      .update({ payment_reference: reference })
  },

  async recordWebhook(eventId, event) {
    try {
      await knex('processed_webhooks').insert({
        event_id: eventId,
        provider: 'paystack',
        payload: event,
      })
      return 'recorded'
    } catch (error: any) {
      if (error.code === '23505') {
        return 'duplicate'
      }
      throw new InternalServerError('Failed to process webhook identity.')
    }
  },

  async markOrderProcessing(orderId, reference) {
    return knex('orders')
      .where({ order_id: orderId, status: 'pending' })
      .update({
        status: 'processing',
        payment_reference: reference,
        updated_at: knex.fn.now(),
      })
  },

  async markOrderProcessingByReference(orderId, reference) {
    const [updatedOrder] = await knex('orders')
      .where({
        order_id: orderId,
        payment_reference: reference,
        status: 'pending',
      })
      .update({ status: 'processing', updated_at: knex.fn.now() })
      .returning('*')
    return updatedOrder ?? null
  },

  async getOrderByIdAndReference(orderId, reference) {
    return knex('orders')
      .where({ order_id: orderId, payment_reference: reference })
      .first()
  },

  async saveCard({ customerId, authorization, customerEmail }) {
    await knex('payment_info')
      .insert({
        customer_id: customerId,
        payment_type: 'card',
        provider: 'paystack',
        authorization_code: authorization.authorization_code,
        email: customerEmail,
        last4: authorization.last4,
        exp_month: authorization.exp_month,
        exp_year: authorization.exp_year,
        brand: authorization.brand,
      })
      .onConflict('authorization_code')
      .ignore()
  },
}
