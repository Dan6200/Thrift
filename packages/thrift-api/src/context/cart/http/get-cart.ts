import { NextFunction, Request, Response } from 'express'
import { getCartUseCase } from '../application/get-cart.js'
import { knexCartRepository } from '../infra/knex-cart-repository.js'

const useCase = getCartUseCase(knexCartRepository)

export const getCartHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  req.dbResult = await useCase(req.userId!)
  next()
}
