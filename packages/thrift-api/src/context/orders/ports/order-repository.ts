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

export type OrderFilter = {
  customer_id?: string
  store_id?: number
}

export type OrderByIdFilter = {
  order_id: number
  customer_id?: string
  store_id?: number
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
  getProfile(userId: string): Promise<{ is_vendor: boolean } | null>
  hasStoreAccess(
    userId: string,
    storeId: number,
    roles: string[],
  ): Promise<boolean>
  getAllOrders(filter: OrderFilter): Promise<unknown>
  getOrderById(filter: OrderByIdFilter): Promise<unknown>
  findReviewableItem(customerId: string, productId: number): Promise<unknown>
}
