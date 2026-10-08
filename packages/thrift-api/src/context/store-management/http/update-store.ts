import { NextFunction, Request, Response } from 'express'
import { updateStoreUseCase } from '../application/update-store.js'
import { knexStoreRepository } from '../infra/knex-store-repository.js'

const useCase = updateStoreUseCase(knexStoreRepository)

export const updateStoreHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { storeId } = req.validatedParams!
  req.dbResult = await useCase({
    storeId: Number(storeId),
    storeData: req.validatedBody!,
  })
  next()
}
