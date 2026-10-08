import { Result, ok, err } from '#src/shared/result.js'
import { DomainError, domainError } from '#src/shared/domain-error.js'
import { ReviewRepository } from '../ports/review-repository.js'

export type UpdateReviewCommand = {
  orderItemId: number
  customerId: string
  rating: number
  customerRemark?: string
}

export const updateReviewUseCase =
  (repository: ReviewRepository) =>
  async (
    command: UpdateReviewCommand,
  ): Promise<Result<unknown, DomainError>> => {
    const existingReview: any = await repository.getById(command.orderItemId)
    if (!existingReview) {
      return err(domainError('NOT_FOUND', 'Review not found.'))
    }
    if (existingReview.customer_id !== command.customerId) {
      return err(
        domainError('UNAUTHORIZED', 'You can only update your own reviews.'),
      )
    }
    return ok(await repository.update(command))
  }
