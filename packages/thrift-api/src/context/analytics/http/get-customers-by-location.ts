import { NextFunction, Request, Response } from 'express'
import { getCustomersByLocationUseCase } from '../application/get-customers-by-location.js'
import { knexAnalyticsRepository } from '../infra/knex-analytics-repository.js'

const useCase = getCustomersByLocationUseCase(knexAnalyticsRepository)

export const getCustomersByLocationHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { storeId } = req.validatedParams!
  req.dbResult = await useCase(Number(storeId), req.validatedQueryParams)
  next()
}
