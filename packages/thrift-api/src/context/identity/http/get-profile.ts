import { NextFunction, Request, Response } from 'express'
import UnauthenticatedError from '#src/errors/unauthenticated.js'
import { getProfileUseCase } from '../application/get-profile.js'
import { knexProfileRepository } from '../infra/knex-profile-repository.js'

const useCase = getProfileUseCase(knexProfileRepository)

export const getProfileHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (!req.userId) {
    throw new UnauthenticatedError('Signin to access user account.')
  }
  req.dbResult = await useCase(req.userId)
  next()
}
