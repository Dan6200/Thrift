// lib/api/cart.ts
import { axiosInstance } from '@/components/axios-instance'

export interface CartItem {
  item_id: number
  variant_id: number
  quantity: number
  created_at: string
  updated_at: string
  product_title: string
  price: number
  image_url: string | null
}

export interface Cart {
  cart_id: number
  customer_id: string
  items: CartItem[]
  total_items: number
  total_price: number
  created_at: string
  updated_at: string
}

export const getCart = async (): Promise<Cart> => {
  const response = await axiosInstance.get('/cart')
  return response.data
}

export const addCartItem = async ({
  variant_id,
  quantity,
}: {
  variant_id: number
  quantity: number
}): Promise<CartItem> => {
  const response = await axiosInstance.post('/cart/items', {
    variant_id,
    quantity,
  })
  return response.data
}

export const updateCartItem = async (
  itemId: number,
  quantity: number,
): Promise<CartItem> => {
  const response = await axiosInstance.put(`/cart/items/${itemId}`, {
    quantity,
  })
  return response.data
}

export const removeCartItem = async (itemId: number): Promise<void> => {
  await axiosInstance.delete(`/cart/items/${itemId}`)
}
