import { Result, ok, err } from '#src/shared/result.js'
import { DomainError, domainError } from '#src/shared/domain-error.js'
import { EventPublisher } from '#src/shared/event.js'
import { PaymentGateway } from '../ports/payment-gateway.js'
import { PaymentRepository } from '../ports/payment-repository.js'

export type HandleWebhookCommand = {
  rawBody: string
  signature: string
  event: any
}

export const handleWebhookUseCase =
  (
    repository: PaymentRepository,
    gateway: PaymentGateway,
    publisher: EventPublisher,
  ) =>
  async (
    command: HandleWebhookCommand,
  ): Promise<Result<unknown, DomainError>> => {
    if (
      !command.signature ||
      !gateway.verifySignature(command.rawBody, command.signature)
    ) {
      return err(
        domainError('INVALID_INPUT', 'Invalid Paystack webhook signature.'),
      )
    }

    const event = command.event
    const eventId = event.id

    if (!eventId) {
      return err(
        domainError('INVALID_INPUT', 'Webhook missing event identifier.'),
      )
    }

    const recordResult = await repository.recordWebhook(eventId, event)
    if (recordResult === 'duplicate') {
      return ok({ message: 'Event already processed.' })
    }

    if (event.event !== 'charge.success') {
      return ok({ message: `Event ${event.event} not handled.` })
    }

    const paystackReference = event.data.reference
    const orderId = event.data.metadata?.order_id

    if (!orderId) {
      return ok({ message: 'Webhook processed (order_id missing/ignored).' })
    }

    const updatedCount = await repository.markOrderProcessing(
      orderId,
      paystackReference,
    )
    if (updatedCount === 0) {
      return ok({ message: 'Order already processed.' })
    }

    await publisher.publish({
      eventType: 'charge.success',
      data: event.data,
    })

    return ok({
      message: 'Payment success received and processing initiated.',
    })
  }
