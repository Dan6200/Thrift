import { Result, ok, err } from '#src/shared/result.js'
import { DomainError, domainError } from '#src/shared/domain-error.js'
import { CartRepository } from '../ports/cart-repository.js'

export type RemoveItemCommand = {
  customerId: string
  itemId: number
}

export const removeItemUseCase =
  (repository: CartRepository) =>
  async (command: RemoveItemCommand): Promise<Result<void, DomainError>> => {
    const cartId = await repository.getCartId(command.customerId)
    if (cartId === null) {
      return err(domainError('NOT_FOUND', 'Cart not found.'))
    }

    const deleted = await repository.removeItem(cartId, command.itemId)
    if (deleted === 0) {
      return err(domainError('NOT_FOUND', 'Item not found in cart.'))
    }

    return ok(undefined)
  }
