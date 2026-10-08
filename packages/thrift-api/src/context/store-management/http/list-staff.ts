import { NextFunction, Request, Response } from 'express'
import { listStaffUseCase } from '../application/list-staff.js'
import { knexStaffRepository } from '../infra/knex-staff-repository.js'

const useCase = listStaffUseCase(knexStaffRepository)

export const listStaffHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { storeId } = req.validatedParams!
  req.dbResult = await useCase(Number(storeId))
  next()
}
