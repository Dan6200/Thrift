import { Result, ok, err } from '#src/shared/result.js'
import { DomainError, domainError } from '#src/shared/domain-error.js'
import { OrderRepository, PersistedOrder } from '../ports/order-repository.js'

export type CancelOrderCommand = {
  customerId: string
  orderId: number
}

export const cancelOrderUseCase =
  (repository: OrderRepository) =>
  async (
    command: CancelOrderCommand,
  ): Promise<Result<PersistedOrder, DomainError>> => {
    const order = await repository.getOrderForMutation(
      command.orderId,
      command.customerId,
    )
    if (!order) {
      return err(domainError('NOT_FOUND', 'Order not found.'))
    }
    if (order.status !== 'pending') {
      return err(
        domainError(
          'CONFLICT',
          `Order is ${order.status} and can no longer be cancelled.`,
        ),
      )
    }

    const persisted = await repository.cancelOrder(command.orderId)
    if (!persisted) {
      return err(
        domainError(
          'CONFLICT',
          'Order changed and can no longer be cancelled.',
        ),
      )
    }

    return ok(persisted)
  }
