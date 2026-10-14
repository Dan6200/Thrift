import { NextFunction, Request, Response } from 'express'
import { toHttpError } from '#src/shared/to-http-error.js'
import { createOrderUseCase } from '../application/create-order.js'
import { knexOrderRepository } from '../infra/knex-order-repository.js'

const useCase = createOrderUseCase(knexOrderRepository)

export const createOrderHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { store_id } = req.validatedQueryParams!
  const { items, delivery_info_id } = req.validatedBody!

  const result = await useCase({
    customerId: req.userId!,
    storeId: store_id as number,
    deliveryInfoId: delivery_info_id as number | undefined,
    items: items.map((item: any) => ({
      variantId: item.variant_id,
      quantity: item.quantity,
    })),
  })

  if (result.kind === 'err') {
    throw toHttpError(result.error)
  }

  req.dbResult = result.value
  next()
}
