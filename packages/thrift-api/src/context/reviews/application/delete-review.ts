import { Result, ok, err } from '#src/shared/result.js'
import { DomainError, domainError } from '#src/shared/domain-error.js'
import { ReviewRepository } from '../ports/review-repository.js'

export type DeleteReviewCommand = {
  orderItemId: number
  customerId: string
}

export const deleteReviewUseCase =
  (repository: ReviewRepository) =>
  async (command: DeleteReviewCommand): Promise<Result<void, DomainError>> => {
    const existingReview: any = await repository.getById(command.orderItemId)
    if (!existingReview) {
      return err(domainError('NOT_FOUND', 'Review not found.'))
    }
    if (existingReview.customer_id !== command.customerId) {
      return err(
        domainError('UNAUTHORIZED', 'You can only delete your own reviews.'),
      )
    }
    await repository.remove(command)
    return ok(undefined)
  }
