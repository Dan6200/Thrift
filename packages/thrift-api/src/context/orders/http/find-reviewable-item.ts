import { NextFunction, Request, Response } from 'express'
import { toHttpError } from '#src/shared/to-http-error.js'
import { findReviewableItemUseCase } from '../application/find-reviewable-item.js'
import { knexOrderRepository } from '../infra/knex-order-repository.js'

const useCase = findReviewableItemUseCase(knexOrderRepository)

export const findReviewableItemHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { product_id } = req.validatedQueryParams!
  const result = await useCase({
    userId: req.userId!,
    productId: Number(product_id),
  })

  if (result.kind === 'err') {
    throw toHttpError(result.error)
  }

  req.dbResult = result.value
  next()
}
