import { NextFunction, Request, Response } from 'express'
import { getAvatarUseCase } from '../application/get-avatar.js'
import { knexMediaRepository } from '../infra/knex-media-repository.js'

const useCase = getAvatarUseCase(knexMediaRepository)

export const getAvatarHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  req.dbResult = await useCase(req.userId!)
  next()
}
