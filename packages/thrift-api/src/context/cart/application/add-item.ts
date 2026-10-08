import { Result, ok } from '#src/shared/result.js'
import { DomainError } from '#src/shared/domain-error.js'
import { validateQuantity } from '../domain/cart.js'
import { CartRepository } from '../ports/cart-repository.js'

export type AddItemCommand = {
  customerId: string
  variantId: number
  quantity: number
}

export const addItemUseCase =
  (repository: CartRepository) =>
  async (command: AddItemCommand): Promise<Result<unknown, DomainError>> => {
    const stock = await repository.getStock(command.variantId)
    const quantityResult = validateQuantity(command.quantity, stock)
    if (quantityResult.kind === 'err') {
      return quantityResult
    }
    return ok(
      await repository.addItem(
        command.customerId,
        command.variantId,
        quantityResult.value,
      ),
    )
  }
