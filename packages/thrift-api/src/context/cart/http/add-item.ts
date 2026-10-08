import { NextFunction, Request, Response } from 'express'
import { toHttpError } from '#src/shared/to-http-error.js'
import { addItemUseCase } from '../application/add-item.js'
import { knexCartRepository } from '../infra/knex-cart-repository.js'

const useCase = addItemUseCase(knexCartRepository)

export const addItemHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { variant_id, quantity } = req.validatedBody!

  const result = await useCase({
    customerId: req.userId!,
    variantId: variant_id as number,
    quantity: quantity as number,
  })

  if (result.kind === 'err') {
    throw toHttpError(result.error)
  }

  req.dbResult = result.value
  next()
}
