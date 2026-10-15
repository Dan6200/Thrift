import { NextFunction, Request, Response } from 'express'
import { toHttpError } from '#src/shared/to-http-error.js'
import { handleCallbackUseCase } from '../application/handle-callback.js'
import { knexPaymentRepository } from '../infra/knex-payment-repository.js'
import { paystackPaymentGateway } from '../infra/paystack-gateway.js'

const useCase = handleCallbackUseCase(
  knexPaymentRepository,
  paystackPaymentGateway,
)

export const handleCallbackHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { reference } = req.validatedQueryParams!

  const result = await useCase({ reference })

  if (result.kind === 'err') {
    throw toHttpError(result.error)
  }

  req.dbResult = result.value
  next()
}
