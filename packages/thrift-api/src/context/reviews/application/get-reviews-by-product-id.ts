import { ReviewRepository } from '../ports/review-repository.js'

export const getReviewsByProductIdUseCase =
  (repository: ReviewRepository) => (productId: number) =>
    repository.getByProductId(productId)
