import { NextFunction, Request, Response } from 'express'
import { updateAvatarUseCase } from '../application/update-avatar.js'
import { knexMediaRepository } from '../infra/knex-media-repository.js'

const useCase = updateAvatarUseCase(knexMediaRepository)

export const updateAvatarHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { userId, body, file } = req
  const { filename, path: filepath, mimetype: filetype } = (file as any) || {}

  req.dbResult = await useCase({
    userId: userId!,
    file: file ? { filename, filepath, filetype } : undefined,
    description: body?.description,
  })
  next()
}
