import { knex } from '#src/db/index.js'
import {
  OrderRepository,
  OrderFilter,
  OrderByIdFilter,
  PersistedOrder,
} from '../ports/order-repository.js'

const assembleOrderItems = async (orderIds: number[]) => {
  if (!orderIds.length) return new Map<number, unknown[]>()
  const rows = await knex('order_items')
    .whereIn('order_id', orderIds)
    .select(
      'order_id',
      'order_item_id',
      'variant_id',
      'quantity',
      'price_at_purchase',
    )
  const byOrderId = new Map<number, unknown[]>()
  for (const row of rows) {
    const items = byOrderId.get(row.order_id) ?? []
    items.push(row)
    byOrderId.set(row.order_id, items)
  }
  return byOrderId
}

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

  async getProfile(userId) {
    const profile = await knex('profiles').where({ id: userId }).first()
    return profile ?? null
  },

  async hasStoreAccess(userId, storeId, roles) {
    const {
      rows: [{ has_store_access }],
    } = await knex.raw('select has_store_access(?, ?, ?)', [
      userId,
      storeId,
      roles,
    ])
    return !!has_store_access
  },

  async getAllOrders(filter: OrderFilter) {
    const orders = await knex('orders').where(filter)
    if (!orders.length) return []
    const itemsByOrderId = await assembleOrderItems(
      orders.map((order) => order.order_id),
    )
    return orders.map((order) => ({
      ...order,
      items: itemsByOrderId.get(order.order_id) ?? [],
    }))
  },

  async getOrderById(filter: OrderByIdFilter) {
    const order = await knex('orders').where(filter).first()
    if (!order) return null
    const itemsByOrderId = await assembleOrderItems([order.order_id])
    return { ...order, items: itemsByOrderId.get(order.order_id) ?? [] }
  },

  async findReviewableItem(customerId, productId) {
    const item = await knex('order_items as oi')
      .join('orders as o', 'oi.order_id', 'o.order_id')
      .join('product_variants as pv', 'oi.variant_id', 'pv.variant_id')
      .join('products as p', 'pv.product_id', 'p.product_id')
      .leftJoin('product_reviews as pr', 'oi.order_item_id', 'pr.order_item_id')
      .where('o.customer_id', customerId)
      .where('p.product_id', productId)
      .whereNull('pr.order_item_id')
      .select('oi.order_item_id')
      .first()
    return item ?? null
  },
}
