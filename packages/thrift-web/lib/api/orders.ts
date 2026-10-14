// lib/api/orders.ts
import { axiosInstance } from '@/components/axios-instance'
import { Order, CreateOrderInput } from '@/types/orders'

export const getAllOrders = async (storeId?: number): Promise<Order[]> => {
  const response = await axiosInstance.get('/orders', {
    params: storeId ? { store_id: storeId } : undefined,
  })
  return response.data
}

export const getOrderById = async (order_id: number): Promise<Order> => {
  const response = await axiosInstance.get(`/orders/${order_id}`)
  return response.data
}

export const createOrder = async (input: CreateOrderInput): Promise<Order> => {
  const response = await axiosInstance.post(
    `/orders?store_id=${input.store_id}`,
    {
      delivery_info_id: input.delivery_info_id ?? null,
      items: input.items,
    },
  )
  return response.data
}

export const cancelOrder = async (order_id: number): Promise<Order> => {
  const response = await axiosInstance.post(`/orders/${order_id}/cancel`)
  return response.data
}

export const findReviewableItem = async (
  productId: number,
): Promise<{ order_item_id: number }> => {
  const response = await axiosInstance.get('/orders/reviewable-item', {
    params: { product_id: productId },
  })
  return response.data
}
