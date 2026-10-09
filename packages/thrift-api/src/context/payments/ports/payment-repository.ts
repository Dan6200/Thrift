export type OrderForPayment = {
  order_id: number
  total_amount: number
  status: string
  customer_id: string
}

export type PaymentRepository = {
  getOrderForPayment(
    orderId: number,
    customerId: string,
  ): Promise<OrderForPayment | null>
  getProfileEmail(userId: string): Promise<string | null>
  updatePaymentReference(orderId: number, reference: string): Promise<void>
  recordWebhook(
    eventId: string,
    event: unknown,
  ): Promise<'recorded' | 'duplicate'>
  markOrderProcessing(orderId: number, reference: string): Promise<number>
  markOrderProcessingByReference(
    orderId: number,
    reference: string,
  ): Promise<unknown | null>
  getOrderByIdAndReference(
    orderId: number,
    reference: string,
  ): Promise<unknown | null>
  saveCard(input: {
    customerId: string
    authorization: any
    customerEmail?: string
  }): Promise<void>
}
