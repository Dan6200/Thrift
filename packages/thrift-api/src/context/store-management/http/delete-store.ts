import { NextFunction, Request, Response } from 'express'
import { deleteStoreUseCase } from '../application/delete-store.js'
import { knexStoreRepository } from '../infra/knex-store-repository.js'

const useCase = deleteStoreUseCase(knexStoreRepository)

export const deleteStoreHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { storeId } = req.validatedParams!
  req.dbResult = await useCase(Number(storeId))
  next()
}
