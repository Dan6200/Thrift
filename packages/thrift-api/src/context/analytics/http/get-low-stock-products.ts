import { NextFunction, Request, Response } from 'express'
import { getLowStockProductsUseCase } from '../application/get-low-stock-products.js'
import { knexAnalyticsRepository } from '../infra/knex-analytics-repository.js'

const useCase = getLowStockProductsUseCase(knexAnalyticsRepository)

export const getLowStockProductsHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { storeId } = req.validatedParams!
  req.dbResult = await useCase(Number(storeId), req.validatedQueryParams)
  next()
}
