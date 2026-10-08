import { NextFunction, Request, Response } from 'express'
import { getKPIsUseCase } from '../application/get-kpis.js'
import { knexAnalyticsRepository } from '../infra/knex-analytics-repository.js'

const useCase = getKPIsUseCase(knexAnalyticsRepository)

export const getKPIsHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { storeId } = req.validatedParams!
  req.dbResult = await useCase(Number(storeId), req.validatedQueryParams)
  next()
}
