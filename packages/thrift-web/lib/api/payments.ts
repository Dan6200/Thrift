// lib/api/payments.ts
import { axiosInstance } from '@/components/axios-instance'

export interface InitializePaymentResponse {
  authorization_url: string
  access_code?: string
  reference: string
}

export const initializePayment = async (
  orderId: number,
  callbackUrl?: string,
): Promise<InitializePaymentResponse> => {
  const response = await axiosInstance.post('/payments/initialize', {
    order_id: orderId,
    callback_url: callbackUrl,
  })
  return response.data
}
