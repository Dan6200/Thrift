import { NextFunction, Request, Response } from 'express'
import { getCustomerAcquisitionTrendsUseCase } from '../application/get-customer-acquisition-trends.js'
import { knexAnalyticsRepository } from '../infra/knex-analytics-repository.js'

const useCase = getCustomerAcquisitionTrendsUseCase(knexAnalyticsRepository)

export const getCustomerAcquisitionTrendsHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { storeId } = req.validatedParams!
  req.dbResult = await useCase(Number(storeId), req.validatedQueryParams)
  next()
}
