import { NextFunction, Request, Response } from 'express'
import { Receiver } from '@upstash/qstash'
import InternalServerError from '#src/errors/internal-server.js'
import { toHttpError } from '#src/shared/to-http-error.js'
import { processOrderJobUseCase } from '../application/process-order-job.js'
import { knexPaymentRepository } from '../infra/knex-payment-repository.js'

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY || '',
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY || '',
})

const useCase = processOrderJobUseCase(knexPaymentRepository)

export const processOrderJobHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const signature = req.headers['upstash-signature'] as string
  const body = JSON.stringify(req.body)

  try {
    const isValid = await receiver.verify({ signature, body })
    if (!isValid) {
      throw new InternalServerError('Invalid job signature.')
    }
  } catch {
    throw new InternalServerError('Job verification failed.')
  }

  const { eventType, data } = req.body
  const result = await useCase({ eventType, data })

  if (result.kind === 'err') {
    throw toHttpError(result.error)
  }

  req.dbResult = result.value
  next()
}
