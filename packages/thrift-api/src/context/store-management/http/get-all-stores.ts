import { NextFunction, Request, Response } from 'express'
import { getAllStoresUseCase } from '../application/get-all-stores.js'
import { knexStoreRepository } from '../infra/knex-store-repository.js'

const useCase = getAllStoresUseCase(knexStoreRepository)

export const getAllStoresHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  req.dbResult = await useCase(req.validatedQueryParams?.vendor_id)
  next()
}
