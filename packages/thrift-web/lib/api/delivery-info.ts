// lib/api/delivery-info.ts
import { axiosInstance } from '@/components/axios-instance'

export interface DeliveryInfoInput {
  recipient_full_name: string
  address_line_1: string
  address_line_2: string
  city: string
  state: string
  zip_postal_code: string
  country: string
  phone_number: string
  delivery_instructions: string
}

export interface DeliveryInfo extends DeliveryInfoInput {
  delivery_info_id: number
  customer_id: string
  address_id: number
  created_at: string
  updated_at: string
}

export const createDeliveryInfo = async (
  data: DeliveryInfoInput,
): Promise<DeliveryInfo> => {
  const response = await axiosInstance.post('/delivery-info', data)
  return response.data
}

export const getDeliveryInfoList = async (): Promise<DeliveryInfo[]> => {
  const response = await axiosInstance.get('/delivery-info')
  return response.data
}

export const getDeliveryInfo = async (
  deliveryInfoId: number,
): Promise<DeliveryInfo> => {
  const response = await axiosInstance.get(`/delivery-info/${deliveryInfoId}`)
  return response.data
}
