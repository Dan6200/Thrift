import { knex } from '#src/db/index.js'
import { ReviewRepository } from '../ports/review-repository.js'

export const knexReviewRepository: ReviewRepository = {
  async getOrderItemOwner(orderItemId) {
    const orderItem = await knex('order_items')
      .where({ order_item_id: orderItemId })
      .join('orders', 'order_items.order_id', 'orders.order_id')
      .select('orders.customer_id')
      .first()
    return orderItem?.customer_id ?? null
  },

  async create({ orderItemId, customerId, rating, customerRemark }) {
    const [review] = await knex('product_reviews')
      .insert({
        order_item_id: orderItemId,
        rating,
        customer_id: customerId,
        customer_remark: customerRemark,
      })
      .returning('*')
    return review
  },

  async getById(orderItemId) {
    return knex('product_reviews').where({ order_item_id: orderItemId }).first()
  },

  async getByProductId(productId) {
    return knex('product_reviews as pr')
      .select(
        'pr.order_item_id',
        'pr.rating',
        'pr.customer_remark',
        'pr.created_at',
        'p.first_name',
        'p.last_name',
      )
      .join('order_items as oi', 'pr.order_item_id', 'oi.order_item_id')
      .join('product_variants as pv', 'oi.variant_id', 'pv.variant_id')
      .join('products as prod', 'pv.product_id', 'prod.product_id')
      .join('profiles as p', 'pr.customer_id', 'p.id')
      .where('prod.product_id', productId)
      .orderBy('pr.created_at', 'desc')
  },

  async update({ orderItemId, customerId, rating, customerRemark }) {
    const [updatedReview] = await knex('product_reviews')
      .where({ order_item_id: orderItemId })
      .andWhere({ customer_id: customerId })
      .update({ rating, customer_remark: customerRemark })
      .returning('*')
    return updatedReview
  },

  async remove({ orderItemId, customerId }) {
    return knex('product_reviews')
      .where({ order_item_id: orderItemId })
      .andWhere({ customer_id: customerId })
      .del()
  },
}
