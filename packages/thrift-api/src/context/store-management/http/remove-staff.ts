import { NextFunction, Request, Response } from 'express'
import { removeStaffUseCase } from '../application/remove-staff.js'
import { knexStaffRepository } from '../infra/knex-staff-repository.js'

const useCase = removeStaffUseCase(knexStaffRepository)

export const removeStaffHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { storeId, staffId } = req.validatedParams!
  await useCase({ storeId: Number(storeId), staffId })
  next()
}
