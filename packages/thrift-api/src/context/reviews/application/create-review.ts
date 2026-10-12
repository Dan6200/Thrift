import { Result, ok, err } from '#src/shared/result.js'
import { DomainError, domainError } from '#src/shared/domain-error.js'
import { ReviewRepository } from '../ports/review-repository.js'

export type CreateReviewCommand = {
  orderItemId: number
  customerId: string
  rating: number
  customerRemark?: string
}

export const createReviewUseCase =
  (repository: ReviewRepository) =>
  async (
    command: CreateReviewCommand,
  ): Promise<Result<unknown, DomainError>> => {
    const ownerId = await repository.getOrderItemOwner(command.orderItemId)
    if (ownerId === null) {
      return err(domainError('NOT_FOUND', 'Order item not found.'))
    }
    if (ownerId !== command.customerId) {
      return err(
        domainError(
          'UNAUTHORIZED',
          'You can only review your own order items.',
        ),
      )
    }

    const existingReview = await repository.getById(command.orderItemId)
    if (existingReview) {
      return err(
        domainError('CONFLICT', 'You have already reviewed this order item.'),
      )
    }

    return ok(await repository.create(command))
  }
