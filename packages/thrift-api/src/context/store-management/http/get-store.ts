import { NextFunction, Request, Response } from 'express'
import { getStoreUseCase } from '../application/get-store.js'
import { knexStoreRepository } from '../infra/knex-store-repository.js'

const useCase = getStoreUseCase(knexStoreRepository)

export const getStoreHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { storeId } = req.validatedParams!
  req.dbResult = await useCase({
    storeId: Number(storeId),
    vendorId: req.validatedQueryParams?.vendor_id,
  })
  next()
}
