import { NextFunction, Request, Response } from 'express'
import { toHttpError } from '#src/shared/to-http-error.js'
import { updateItemUseCase } from '../application/update-item.js'
import { knexCartRepository } from '../infra/knex-cart-repository.js'

const useCase = updateItemUseCase(knexCartRepository)

export const updateItemHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { itemId } = req.validatedParams!
  const { quantity } = req.validatedBody!

  const result = await useCase({
    customerId: req.userId!,
    itemId: Number(itemId),
    quantity: quantity as number,
  })

  if (result.kind === 'err') {
    throw toHttpError(result.error)
  }

  req.dbResult = result.value
  next()
}
