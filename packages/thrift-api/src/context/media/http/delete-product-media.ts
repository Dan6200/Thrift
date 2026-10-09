import { NextFunction, Request, Response } from 'express'
import { deleteProductMediaUseCase } from '../application/delete-product-media.js'
import { knexMediaRepository } from '../infra/knex-media-repository.js'

const useCase = deleteProductMediaUseCase(knexMediaRepository)

export const deleteProductMediaHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { mediaId } = req.params
  await useCase(Number(mediaId))
  next()
}
