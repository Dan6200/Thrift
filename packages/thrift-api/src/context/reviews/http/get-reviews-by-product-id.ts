import { NextFunction, Request, Response } from 'express'
import { getReviewsByProductIdUseCase } from '../application/get-reviews-by-product-id.js'
import { knexReviewRepository } from '../infra/knex-review-repository.js'

const useCase = getReviewsByProductIdUseCase(knexReviewRepository)

export const getReviewsByProductIdHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { product_id } = req.validatedParams!
  req.dbResult = await useCase(Number(product_id))
  next()
}
