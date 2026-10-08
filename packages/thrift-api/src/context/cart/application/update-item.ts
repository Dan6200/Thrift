import { Result, ok, err } from '#src/shared/result.js'
import { DomainError, domainError } from '#src/shared/domain-error.js'
import { validateQuantity } from '../domain/cart.js'
import { CartRepository } from '../ports/cart-repository.js'

export type UpdateItemCommand = {
  customerId: string
  itemId: number
  quantity: number
}

export const updateItemUseCase =
  (repository: CartRepository) =>
  async (command: UpdateItemCommand): Promise<Result<unknown, DomainError>> => {
    const cartId = await repository.getCartId(command.customerId)
    if (cartId === null) {
      return err(domainError('NOT_FOUND', 'Cart not found.'))
    }

    const item = await repository.getCartItem(cartId, command.itemId)
    if (!item) {
      return err(domainError('NOT_FOUND', 'Item not found in cart.'))
    }

    const stock = await repository.getStock(item.variant_id)
    const quantityResult = validateQuantity(command.quantity, stock)
    if (quantityResult.kind === 'err') {
      return quantityResult
    }

    return ok(
      await repository.updateItem(cartId, command.itemId, quantityResult.value),
    )
  }
