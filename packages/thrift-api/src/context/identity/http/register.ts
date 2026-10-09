import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { toHttpError } from '#src/shared/to-http-error.js'
import { registerUseCase } from '../application/register.js'
import { supabaseAuthGateway } from '../infra/supabase-auth-gateway.js'

const useCase = registerUseCase(supabaseAuthGateway)

export const registerHandler = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const {
    email,
    password,
    first_name,
    last_name,
    phone,
    dob,
    country,
    is_vendor,
  } = req.body

  const result = await useCase({
    email,
    password,
    firstName: first_name,
    lastName: last_name,
    phone,
    dob,
    country,
    isVendor: is_vendor || false,
  })

  if (result.kind === 'err') {
    throw toHttpError(result.error)
  }

  res.status(StatusCodes.CREATED).json(result.value)
}
