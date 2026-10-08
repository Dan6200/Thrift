export type CreateDeliveryInput = {
  customerId: string
  deliveryInstructions?: string
  recipientFullName: string
  phoneNumber: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zipPostalCode: string
  country: string
}

export type UpdateDeliveryInput = {
  customerId: string
  deliveryInfoId: number
  deliveryInstructions?: string
  recipientFullName?: string
  phoneNumber?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  zipPostalCode?: string
  country?: string
}

export type DeliveryInfoRepository = {
  create(input: CreateDeliveryInput): Promise<unknown>
  getAll(customerId: string): Promise<unknown>
  getById(customerId: string, deliveryInfoId: number): Promise<unknown>
  update(input: UpdateDeliveryInput): Promise<unknown>
  remove(customerId: string, deliveryInfoId: number): Promise<unknown>
}
