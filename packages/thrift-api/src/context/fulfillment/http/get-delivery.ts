import { NextFunction, Request, Response } from 'express'
import { getDeliveryUseCase } from '../application/get-delivery.js'
import { knexDeliveryInfoRepository } from '../infra/knex-delivery-info-repository.js'

const useCase = getDeliveryUseCase(knexDeliveryInfoRepository)

export const getDeliveryHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { deliveryInfoId } = req.validatedParams!
  req.dbResult = await useCase(req.userId!, Number(deliveryInfoId))
  next()
}
