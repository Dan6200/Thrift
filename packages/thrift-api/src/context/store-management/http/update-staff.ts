import { NextFunction, Request, Response } from 'express'
import { updateStaffUseCase } from '../application/update-staff.js'
import { knexStaffRepository } from '../infra/knex-staff-repository.js'

const useCase = updateStaffUseCase(knexStaffRepository)

export const updateStaffHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { storeId, staffId } = req.validatedParams!
  const { role } = req.validatedBody!
  req.dbResult = await useCase({
    storeId: Number(storeId),
    staffId,
    role,
  })
  next()
}
