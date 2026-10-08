import { NextFunction, Request, Response } from 'express'
import { getSalesAnalyticsUseCase } from '../application/get-sales-analytics.js'
import { knexAnalyticsRepository } from '../infra/knex-analytics-repository.js'

const useCase = getSalesAnalyticsUseCase(knexAnalyticsRepository)

export const getSalesAnalyticsHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { storeId } = req.validatedParams!
  req.dbResult = await useCase(Number(storeId), req.validatedQueryParams)
  next()
}
