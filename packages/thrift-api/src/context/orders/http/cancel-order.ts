import { NextFunction, Request, Response } from 'express'
import { toHttpError } from '#src/shared/to-http-error.js'
import { cancelOrderUseCase } from '../application/cancel-order.js'
import { knexOrderRepository } from '../infra/knex-order-repository.js'

const useCase = cancelOrderUseCase(knexOrderRepository)

export const cancelOrderHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { order_id } = req.validatedParams!

  const result = await useCase({
    customerId: req.userId!,
    orderId: Number(order_id),
  })

  if (result.kind === 'err') {
    throw toHttpError(result.error)
  }

  req.dbResult = result.value
  next()
}
