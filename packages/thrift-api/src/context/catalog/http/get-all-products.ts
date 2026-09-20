import { NextFunction, Request, Response } from 'express'
import { getAllProductsUseCase } from '../application/get-all-products.js'
import { knexProductRepository } from '../infra/knex-product-repository.js'

const useCase = getAllProductsUseCase(knexProductRepository)

export const getAllProductsHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { storeId, limit, sort, offset } = req.validatedQueryParams!
  req.dbResult = await useCase({
    vendorId: req.userId,
    storeId: storeId as number | undefined,
    sort: sort as string | undefined,
    limit: limit as number | undefined,
    offset: offset as number | undefined,
  })
  next()
}
