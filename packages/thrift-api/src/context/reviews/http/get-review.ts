import { NextFunction, Request, Response } from 'express'
import { getReviewUseCase } from '../application/get-review.js'
import { knexReviewRepository } from '../infra/knex-review-repository.js'

const useCase = getReviewUseCase(knexReviewRepository)

export const getReviewHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { order_item_id } = req.validatedParams!
  req.dbResult = await useCase(Number(order_item_id))
  next()
}
