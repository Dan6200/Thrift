import { NextFunction, Request, Response } from 'express'
import { toHttpError } from '#src/shared/to-http-error.js'
import { amendOrderUseCase } from '../application/amend-order.js'
import { knexOrderRepository } from '../infra/knex-order-repository.js'

const useCase = amendOrderUseCase(knexOrderRepository)

export const amendOrderHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { order_id } = req.validatedParams!
  const { items } = req.validatedBody!

  const result = await useCase({
    customerId: req.userId!,
    orderId: Number(order_id),
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
