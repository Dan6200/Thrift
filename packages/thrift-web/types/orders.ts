// types/orders.ts

export interface OrderItem {
  order_id?: number
  order_item_id: number
  variant_id: number
  quantity: number
  price_at_purchase: number
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'failed'
  | 'cancelled'
  | 'shipped'
  | 'delivered'
  | 'refunded'

export interface Order {
  order_id: number
  customer_id: string
  store_id: number
  delivery_info_id: number | null
  order_date: string
  total_amount: number
  status: OrderStatus | string
  payment_reference?: string | null
  created_at: string
  updated_at: string
  items: OrderItem[]
}

export interface CreateOrderItem {
  variant_id: number
  quantity: number
}

export interface CreateOrderInput {
  store_id: number
  delivery_info_id?: number | null
  items: CreateOrderItem[]
}
