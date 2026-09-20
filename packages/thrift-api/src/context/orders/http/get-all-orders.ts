import { NextFunction, Request, Response } from 'express'
import { toHttpError } from '#src/shared/to-http-error.js'
import { getAllOrdersUseCase } from '../application/get-all-orders.js'
import { knexOrderRepository } from '../infra/knex-order-repository.js'

const useCase = getAllOrdersUseCase(knexOrderRepository)

export const getAllOrdersHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { store_id } = req.validatedQueryParams!
  const result = await useCase({
    userId: req.userId!,
    storeId: store_id as number | undefined,
  })

  if (result.kind === 'err') {
    throw toHttpError(result.error)
  }

  req.dbResult = result.value
  next()
}
