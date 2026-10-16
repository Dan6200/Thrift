import { NextFunction, Request, Response } from 'express'
import { updateProductMediaUseCase } from '../application/update-product-media.js'
import { knexMediaRepository } from '../infra/knex-media-repository.js'
import { cloudinaryMediaStorage } from '../infra/cloudinary-storage.js'

const useCase = updateProductMediaUseCase(
  cloudinaryMediaStorage,
  knexMediaRepository,
)

export const updateProductMediaHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { mediaId } = req.params
  const { description, filetype } = req.body

  req.dbResult = await useCase({
    mediaId: Number(mediaId),
    file: req.file,
    description,
    filetype,
  })
  next()
}
