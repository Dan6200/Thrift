import { NextFunction, Request, Response } from 'express'
import { createStoreUseCase } from '../application/create-store.js'
import { knexStoreRepository } from '../infra/knex-store-repository.js'

const useCase = createStoreUseCase(knexStoreRepository)

export const createStoreHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  req.dbResult = await useCase({
    vendorId: req.userId!,
    storeData: req.validatedBody!,
  })
  next()
}
