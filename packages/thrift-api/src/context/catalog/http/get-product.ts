import { NextFunction, Request, Response } from 'express'
import { getProductUseCase } from '../application/get-product.js'
import { knexProductRepository } from '../infra/knex-product-repository.js'

const useCase = getProductUseCase(knexProductRepository)

export const getProductHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { productId } = req.validatedParams!
  const { storeId } = req.validatedQueryParams || {}
  req.dbResult = await useCase({
    productId: Number(productId),
    vendorId: req.userId,
    storeId: storeId as number | undefined,
  })
  next()
}
