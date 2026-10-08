import { NextFunction, Request, Response } from 'express'
import { getCustomerLifetimeValueUseCase } from '../application/get-customer-lifetime-value.js'
import { knexAnalyticsRepository } from '../infra/knex-analytics-repository.js'

const useCase = getCustomerLifetimeValueUseCase(knexAnalyticsRepository)

export const getCustomerLifetimeValueHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { storeId } = req.validatedParams!
  req.dbResult = await useCase(Number(storeId), req.validatedQueryParams)
  next()
}
