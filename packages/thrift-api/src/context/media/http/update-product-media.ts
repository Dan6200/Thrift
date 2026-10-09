import { NextFunction, Request, Response } from 'express'
import { updateProductMediaUseCase } from '../application/update-product-media.js'
import { knexMediaRepository } from '../infra/knex-media-repository.js'

const useCase = updateProductMediaUseCase(knexMediaRepository)

export const updateProductMediaHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { mediaId } = req.params
  const { description, filetype } = req.body
  const { filename, path: filepath } = (req.file as any) || {}

  req.dbResult = await useCase({
    mediaId: Number(mediaId),
    file: req.file ? { filename, filepath } : undefined,
    description,
    filetype,
  })
  next()
}
