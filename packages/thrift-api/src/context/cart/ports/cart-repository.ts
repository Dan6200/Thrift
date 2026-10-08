export type CartRepository = {
  getCart(customerId: string): Promise<unknown>
  getStock(variantId: number): Promise<number>
  getCartId(customerId: string): Promise<number | null>
  getCartItem(
    cartId: number,
    itemId: number,
  ): Promise<{ variant_id: number } | null>
  addItem(
    customerId: string,
    variantId: number,
    quantity: number,
  ): Promise<unknown>
  updateItem(cartId: number, itemId: number, quantity: number): Promise<unknown>
  removeItem(cartId: number, itemId: number): Promise<number>
}
