import { NextFunction, Request, Response } from 'express'
import { toHttpError } from '#src/shared/to-http-error.js'
import { removeItemUseCase } from '../application/remove-item.js'
import { knexCartRepository } from '../infra/knex-cart-repository.js'

const useCase = removeItemUseCase(knexCartRepository)

export const removeItemHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { itemId } = req.validatedParams!

  const result = await useCase({
    customerId: req.userId!,
    itemId: Number(itemId),
  })

  if (result.kind === 'err') {
    throw toHttpError(result.error)
  }

  next()
}
