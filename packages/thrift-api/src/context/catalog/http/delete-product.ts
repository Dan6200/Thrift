import { NextFunction, Request, Response } from 'express'
import { deleteProductUseCase } from '../application/delete-product.js'
import { knexProductRepository } from '../infra/knex-product-repository.js'

const useCase = deleteProductUseCase(knexProductRepository)

export const deleteProductHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { productId } = req.validatedParams!
  const { storeId } = req.validatedQueryParams!
  await useCase({
    productId: Number(productId),
    storeId: storeId as number,
    vendorId: req.userId!,
  })
  next()
}
