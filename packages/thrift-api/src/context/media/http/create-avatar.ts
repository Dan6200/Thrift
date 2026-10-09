import { NextFunction, Request, Response } from 'express'
import BadRequestError from '#src/errors/bad-request.js'
import { createAvatarUseCase } from '../application/create-avatar.js'
import { knexMediaRepository } from '../infra/knex-media-repository.js'

const useCase = createAvatarUseCase(knexMediaRepository)

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

  const { filename, path: filepath, mimetype: filetype } = file as any
  req.dbResult = await useCase({
    userId,
    file: { filename, filepath, filetype },
    description: body?.description,
  })
  next()
}
