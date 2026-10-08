import { NextFunction, Request, Response } from 'express'
import { toHttpError } from '#src/shared/to-http-error.js'
import { deleteReviewUseCase } from '../application/delete-review.js'
import { knexReviewRepository } from '../infra/knex-review-repository.js'

const useCase = deleteReviewUseCase(knexReviewRepository)

export const deleteReviewHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { order_item_id } = req.validatedParams!

  const result = await useCase({
    orderItemId: Number(order_item_id),
    customerId: req.userId!,
  })

  if (result.kind === 'err') {
    throw toHttpError(result.error)
  }

  next()
}
