import { NextFunction, Request, Response } from 'express'
import { getRevenueTrendsUseCase } from '../application/get-revenue-trends.js'
import { knexAnalyticsRepository } from '../infra/knex-analytics-repository.js'

const useCase = getRevenueTrendsUseCase(knexAnalyticsRepository)

export const getRevenueTrendsHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { storeId } = req.validatedParams!
  req.dbResult = await useCase(Number(storeId), req.validatedQueryParams)
  next()
}
