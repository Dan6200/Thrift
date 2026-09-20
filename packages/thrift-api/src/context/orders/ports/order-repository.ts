import { Order } from '../domain/order.js'

export type PersistedOrderItem = {
  order_item_id: number
  variant_id: number
  quantity: number
  price_at_purchase: number
}

export type PersistedOrder = {
  order_id: number
  customer_id: string
  store_id: number
  delivery_info_id: number | null
  order_date: string
  total_amount: number
  status: string
  created_at: string
  updated_at: string
  items: PersistedOrderItem[]
}

export type CreateOrderInput = {
  order: Order
}

export type OrderRepository = {
  storeExists(storeId: number): Promise<boolean>
  deliveryInfoBelongsTo(
    deliveryInfoId: number,
    customerId: string,
  ): Promise<boolean>
  getVariantPrices(variantIds: number[]): Promise<Map<number, number>>
  getAvailableStock(variantIds: number[]): Promise<Map<number, number>>
  create(input: CreateOrderInput): Promise<PersistedOrder>
}
