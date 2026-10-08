import { NextFunction, Request, Response } from 'express'
import { updateDeliveryUseCase } from '../application/update-delivery.js'
import { knexDeliveryInfoRepository } from '../infra/knex-delivery-info-repository.js'

const useCase = updateDeliveryUseCase(knexDeliveryInfoRepository)

export const updateDeliveryHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { deliveryInfoId } = req.validatedParams!
  const body = req.validatedBody!
  req.dbResult = await useCase({
    customerId: req.userId!,
    deliveryInfoId: Number(deliveryInfoId),
    deliveryInstructions: body.delivery_instructions,
    recipientFullName: body.recipient_full_name,
    phoneNumber: body.phone_number,
    addressLine1: body.address_line_1,
    addressLine2: body.address_line_2,
    city: body.city,
    state: body.state,
    zipPostalCode: body.zip_postal_code,
    country: body.country,
  })
  next()
}
