import { Result, ok, err } from '#src/shared/result.js'
import { DomainError, domainError } from '#src/shared/domain-error.js'
import { PaymentGateway } from '../ports/payment-gateway.js'
import { PaymentRepository } from '../ports/payment-repository.js'

export type HandleCallbackCommand = {
  reference: string
}

export const handleCallbackUseCase =
  (repository: PaymentRepository, gateway: PaymentGateway) =>
  async (
    command: HandleCallbackCommand,
  ): Promise<Result<unknown, DomainError>> => {
    const order = await repository.getOrderByReference(command.reference)
    if (!order) {
      return err(
        domainError(
          'NOT_FOUND',
          'No order found matching this payment reference.',
        ),
      )
    }

    if (order.status !== 'pending') {
      return ok({
        order_id: order.order_id,
        status: order.status,
        already_processed: true,
      })
    }

    try {
      const verification = await gateway.verifyTransaction(command.reference)

      if (!verification.status || verification.data.status !== 'success') {
        await repository.markOrderFailed(order.order_id)
        return ok({
          order_id: order.order_id,
          status: 'failed',
          message: 'Payment verification failed.',
        })
      }

      const updatedCount = await repository.markOrderProcessingByOrderId(
        order.order_id,
      )
      return ok({
        order_id: order.order_id,
        status: 'processing',
        already_processed: updatedCount === 0,
      })
    } catch (error: any) {
      return err(
        domainError(
          'INTERNAL',
          `Callback verification failed: ${error.message}`,
        ),
      )
    }
  }
