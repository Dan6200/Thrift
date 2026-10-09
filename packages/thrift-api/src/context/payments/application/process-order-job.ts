import { Result, ok, err } from '#src/shared/result.js'
import { DomainError, domainError } from '#src/shared/domain-error.js'
import { PaymentRepository } from '../ports/payment-repository.js'

export type ProcessOrderJobCommand = {
  eventType: string
  data: any
}

export const processOrderJobUseCase =
  (repository: PaymentRepository) =>
  async (
    command: ProcessOrderJobCommand,
  ): Promise<Result<unknown, DomainError>> => {
    if (command.eventType !== 'charge.success') {
      return ok({
        message: `Event type ${command.eventType} ignored by processor.`,
      })
    }

    const paystackReference = command.data.reference
    const orderId = command.data.metadata?.order_id

    if (!orderId) {
      return ok({ message: 'order_id missing/ignored.' })
    }

    const updatedOrder = await repository.markOrderProcessingByReference(
      orderId,
      paystackReference,
    )

    if (!updatedOrder) {
      const existingOrder = await repository.getOrderByIdAndReference(
        orderId,
        paystackReference,
      )
      if (existingOrder && (existingOrder as any).status !== 'pending') {
        return ok({ message: 'Order already processed.' })
      }
      return err(
        domainError(
          'NOT_FOUND',
          `Order ${orderId} with reference ${paystackReference} not found or is in an invalid state.`,
        ),
      )
    }

    const saveCard = command.data.metadata?.save_card
    const authorization = command.data.authorization

    if (saveCard && authorization && authorization.reusable) {
      await repository.saveCard({
        customerId: command.data.metadata?.customer_id,
        customerEmail: command.data.customer?.email,
        authorization,
      })
    }

    return ok({
      message: 'Order processed successfully',
      order: updatedOrder,
    })
  }
