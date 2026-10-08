import { NextFunction, Request, Response } from 'express'
import { toHttpError } from '#src/shared/to-http-error.js'
import { createReviewUseCase } from '../application/create-review.js'
import { knexReviewRepository } from '../infra/knex-review-repository.js'

const useCase = createReviewUseCase(knexReviewRepository)

export const createReviewHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { order_item_id } = req.validatedParams!
  const { rating, customer_remark } = req.validatedBody!

  const result = await useCase({
    orderItemId: Number(order_item_id),
    customerId: req.userId!,
    rating,
    customerRemark: customer_remark,
  })

  if (result.kind === 'err') {
    throw toHttpError(result.error)
  }

  req.dbResult = result.value
  next()
}
