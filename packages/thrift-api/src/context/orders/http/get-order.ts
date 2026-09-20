import { NextFunction, Request, Response } from 'express'
import { toHttpError } from '#src/shared/to-http-error.js'
import { getOrderUseCase } from '../application/get-order.js'
import { knexOrderRepository } from '../infra/knex-order-repository.js'

const useCase = getOrderUseCase(knexOrderRepository)

export const getOrderHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { order_id } = req.validatedParams!
  const { store_id } = req.validatedQueryParams || {}
  const result = await useCase({
    userId: req.userId!,
    orderId: Number(order_id),
    storeId: store_id as number | undefined,
  })

  if (result.kind === 'err') {
    throw toHttpError(result.error)
  }

  req.dbResult = result.value
  next()
}
