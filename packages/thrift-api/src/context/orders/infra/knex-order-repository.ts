import { knex } from '#src/db/index.js'
import { OrderRepository, PersistedOrder } from '../ports/order-repository.js'

export const knexOrderRepository: OrderRepository = {
  async storeExists(storeId) {
    const store = await knex('stores').where({ store_id: storeId }).first()
    return !!store
  },

  async deliveryInfoBelongsTo(deliveryInfoId, customerId) {
    const info = await knex('delivery_info')
      .where({ delivery_info_id: deliveryInfoId, customer_id: customerId })
      .first()
    return !!info
  },

  async getVariantPrices(variantIds) {
    const rows = await knex('product_variants')
      .whereIn('variant_id', variantIds)
      .select('variant_id', 'base_price')
    return new Map(rows.map((row) => [row.variant_id, Number(row.base_price)]))
  },

  async getAvailableStock(variantIds) {
    const rows = await knex('product_variant_inventory')
      .whereIn('variant_id', variantIds)
      .select('variant_id', 'quantity_available')
    return new Map(
      rows.map((row) => [row.variant_id, Number(row.quantity_available)]),
    )
  },

  async create({ order }) {
    const created = await knex.transaction(async (trx) => {
      const [orderRow] = await trx('orders')
        .insert({
          customer_id: order.customerId,
          store_id: order.storeId,
          delivery_info_id: order.deliveryInfoId ?? null,
          total_amount: order.totalAmount,
          status: order.status,
        })
        .returning('*')

      const persistedItems = []
      for (const item of order.items) {
        const [orderItem] = await trx('order_items')
          .insert({
            order_id: orderRow.order_id,
            variant_id: item.variantId,
            quantity: item.quantity,
            price_at_purchase: item.priceAtPurchase,
          })
          .returning('*')

        persistedItems.push({
          order_item_id: orderItem.order_item_id,
          variant_id: orderItem.variant_id,
          quantity: orderItem.quantity,
          price_at_purchase: orderItem.price_at_purchase,
        })

        await trx('inventory').insert({
          variant_id: item.variantId,
          quantity_change: -item.quantity,
          reason: 'sale',
          notes: `Order ${orderRow.order_id}`,
        })
      }

      return { ...orderRow, items: persistedItems }
    })

    return created as PersistedOrder
  },
}
