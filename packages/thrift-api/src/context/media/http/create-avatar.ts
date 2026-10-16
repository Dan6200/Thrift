import { NextFunction, Request, Response } from 'express'
import BadRequestError from '#src/errors/bad-request.js'
import { createAvatarUseCase } from '../application/create-avatar.js'
import { knexMediaRepository } from '../infra/knex-media-repository.js'
import { cloudinaryMediaStorage } from '../infra/cloudinary-storage.js'

const useCase = createAvatarUseCase(cloudinaryMediaStorage, knexMediaRepository)

export const createAvatarHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { userId, body, file } = req

  if (!userId) {
    throw new BadRequestError('User not found')
  }
  if (!file) {
    throw new BadRequestError('No file uploaded')
  }

  req.dbResult = await useCase({
    userId,
    file,
    description: body?.description,
  })
  next()
}
