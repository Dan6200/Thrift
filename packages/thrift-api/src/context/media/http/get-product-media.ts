import { NextFunction, Request, Response } from 'express'
import { getProductMediaUseCase } from '../application/get-product-media.js'
import { knexMediaRepository } from '../infra/knex-media-repository.js'

const useCase = getProductMediaUseCase(knexMediaRepository)

export const getProductMediaHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { mediaId } = req.params
  req.dbResult = await useCase(Number(mediaId))
  next()
}
