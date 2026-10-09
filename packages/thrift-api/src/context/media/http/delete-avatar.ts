import { NextFunction, Request, Response } from 'express'
import { deleteAvatarUseCase } from '../application/delete-avatar.js'
import { knexMediaRepository } from '../infra/knex-media-repository.js'

const useCase = deleteAvatarUseCase(knexMediaRepository)

export const deleteAvatarHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  await useCase(req.userId!)
  next()
}
