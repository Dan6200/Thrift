import { OrderRepository } from '#src/context/orders/ports/order-repository.js'

const notImplemented = (): never => {
  throw new Error('not implemented in test fake')
}

/**
 * A plain-object fake of the OrderRepository port. Override only the methods a
 * given test exercises; every other method records that it was (unexpectedly)
 * called.
 */
export const makeOrderRepo = (
  overrides: Partial<OrderRepository> = {},
): OrderRepository => ({
  async storeExists(): Promise<boolean> {
    return true
  },
  async deliveryInfoBelongsTo(): Promise<boolean> {
    return true
  },
  async getVariantPrices(): Promise<Map<number, number>> {
    return new Map()
  },
  async getAvailableStock(): Promise<Map<number, number>> {
    return new Map()
  },
  async create(): Promise<any> {
    return notImplemented()
  },
  async getProfile(): Promise<{ is_vendor: boolean } | null> {
    return null
  },
  async hasStoreAccess(): Promise<boolean> {
    return false
  },
  async getAllOrders(): Promise<unknown> {
    return []
  },
  async getOrderById(): Promise<unknown> {
    return null
  },
  async findReviewableItem(): Promise<unknown> {
    return null
  },
  async getOrderForMutation(): Promise<any> {
    return null
  },
  async amendOrder(): Promise<any> {
    return null
  },
  async cancelOrder(): Promise<any> {
    return null
  },
  ...overrides,
})
