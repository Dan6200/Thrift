import { NextFunction, Request, Response } from 'express'
import { getTopSellingProductsUseCase } from '../application/get-top-selling-products.js'
import { knexAnalyticsRepository } from '../infra/knex-analytics-repository.js'

const useCase = getTopSellingProductsUseCase(knexAnalyticsRepository)

export const getTopSellingProductsHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { storeId } = req.validatedParams!
  req.dbResult = await useCase(Number(storeId), req.validatedQueryParams)
  next()
}
