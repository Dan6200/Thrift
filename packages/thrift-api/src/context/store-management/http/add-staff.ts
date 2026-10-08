import { NextFunction, Request, Response } from 'express'
import { addStaffUseCase } from '../application/add-staff.js'
import { knexStaffRepository } from '../infra/knex-staff-repository.js'

const useCase = addStaffUseCase(knexStaffRepository)

export const addStaffHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { storeId } = req.validatedParams!
  const { staff_id, role } = req.validatedBody!
  req.dbResult = await useCase({
    storeId: Number(storeId),
    staffId: staff_id,
    role,
  })
  next()
}
