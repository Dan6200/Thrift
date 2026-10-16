import { NextFunction, Request, Response } from 'express'
import { updateAvatarUseCase } from '../application/update-avatar.js'
import { knexMediaRepository } from '../infra/knex-media-repository.js'
import { cloudinaryMediaStorage } from '../infra/cloudinary-storage.js'

const useCase = updateAvatarUseCase(cloudinaryMediaStorage, knexMediaRepository)

export const updateAvatarHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { userId, body, file } = req

  req.dbResult = await useCase({
    userId: userId!,
    file,
    description: body?.description,
  })
  next()
}
