import { NextFunction, Request, Response } from 'express'
import { toHttpError } from '#src/shared/to-http-error.js'
import { handleWebhookUseCase } from '../application/handle-webhook.js'
import { paystackPaymentGateway } from '../infra/paystack-gateway.js'
import { knexPaymentRepository } from '../infra/knex-payment-repository.js'
import { qstashEventPublisher } from '../infra/qstash-event-publisher.js'

const useCase = handleWebhookUseCase(
  knexPaymentRepository,
  paystackPaymentGateway,
  qstashEventPublisher,
)

export const handleWebhookHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const signature = req.headers['x-paystack-signature'] as string
  const rawBody = (req as any).rawBody || JSON.stringify(req.body)
  const event = req.body

  const result = await useCase({ rawBody, signature, event })

  if (result.kind === 'err') {
    throw toHttpError(result.error)
  }

  req.dbResult = result.value
  next()
}
