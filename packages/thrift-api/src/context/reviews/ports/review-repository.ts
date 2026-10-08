export type ReviewRepository = {
  getOrderItemOwner(orderItemId: number): Promise<string | null>
  create(input: {
    orderItemId: number
    customerId: string
    rating: number
    customerRemark?: string
  }): Promise<unknown>
  getById(orderItemId: number): Promise<unknown>
  getByProductId(productId: number): Promise<unknown>
  update(input: {
    orderItemId: number
    customerId: string
    rating: number
    customerRemark?: string
  }): Promise<unknown>
  remove(input: { orderItemId: number; customerId: string }): Promise<number>
}
