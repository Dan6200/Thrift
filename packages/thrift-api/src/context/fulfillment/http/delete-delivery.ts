import { NextFunction, Request, Response } from 'express'
import { deleteDeliveryUseCase } from '../application/delete-delivery.js'
import { knexDeliveryInfoRepository } from '../infra/knex-delivery-info-repository.js'

const useCase = deleteDeliveryUseCase(knexDeliveryInfoRepository)

export const deleteDeliveryHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { deliveryInfoId } = req.validatedParams!
  req.dbResult = await useCase(req.userId!, Number(deliveryInfoId))
  next()
}
