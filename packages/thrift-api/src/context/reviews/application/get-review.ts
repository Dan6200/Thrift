import { ReviewRepository } from '../ports/review-repository.js'

export const getReviewUseCase =
  (repository: ReviewRepository) => (orderItemId: number) =>
    repository.getById(orderItemId)
