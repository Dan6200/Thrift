import { NextFunction, Request, Response } from 'express'
import { getAllDeliveriesUseCase } from '../application/get-all-deliveries.js'
import { knexDeliveryInfoRepository } from '../infra/knex-delivery-info-repository.js'

const useCase = getAllDeliveriesUseCase(knexDeliveryInfoRepository)

export const getAllDeliveriesHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  req.dbResult = await useCase(req.userId!)
  next()
}
