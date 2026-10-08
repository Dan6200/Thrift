import { CartRepository } from '../ports/cart-repository.js'

export const getCartUseCase =
  (repository: CartRepository) => (customerId: string) =>
    repository.getCart(customerId)
