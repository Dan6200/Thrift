import { NextFunction, Request, Response } from 'express'
import { deleteVariantUseCase } from '../application/delete-variant.js'
import { knexProductRepository } from '../infra/knex-product-repository.js'

const useCase = deleteVariantUseCase(knexProductRepository)

export const deleteVariantHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { productId, variantId } = req.validatedParams!
  const { storeId } = req.validatedQueryParams!
  await useCase({
    productId: Number(productId),
    variantId: Number(variantId),
    storeId: storeId as number,
  })
  next()
}
