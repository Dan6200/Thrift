import { NextFunction, Request, Response } from 'express'
import UnauthenticatedError from '#src/errors/unauthenticated.js'
import { toHttpError } from '#src/shared/to-http-error.js'
import { initializePaymentUseCase } from '../application/initialize-payment.js'
import { paystackPaymentGateway } from '../infra/paystack-gateway.js'
import { knexPaymentRepository } from '../infra/knex-payment-repository.js'

const useCase = initializePaymentUseCase(
  knexPaymentRepository,
  paystackPaymentGateway,
)

export const initializePaymentHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { userId } = req
  if (!userId) {
    throw new UnauthenticatedError(
      'Authentication required to initialize payment.',
    )
  }

  const { order_id, callback_url } = req.validatedBody!
  const { save_card } = req.validatedQueryParams || {}

  const result = await useCase({
    userId,
    orderId: order_id,
    callbackUrl: callback_url,
    saveCard: save_card || false,
  })

  if (result.kind === 'err') {
    throw toHttpError(result.error)
  }

  req.dbResult = result.value
  next()
}
