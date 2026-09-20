import { Result, ok, err } from '#src/shared/result.js'
import { DomainError, domainError } from '#src/shared/domain-error.js'
import { OrderRepository } from '../ports/order-repository.js'

export type FindReviewableItemCommand = {
  userId: string
  productId: number
}

export const findReviewableItemUseCase =
  (repository: OrderRepository) =>
  async (
    command: FindReviewableItemCommand,
  ): Promise<Result<unknown, DomainError>> => {
    const item = await repository.findReviewableItem(
      command.userId,
      command.productId,
    )
    if (!item) {
      return err(
        domainError(
          'NOT_FOUND',
          'No reviewable order item found for this product. You must purchase an item to review it.',
        ),
      )
    }
    return ok(item)
  }
