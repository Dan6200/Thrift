import { Result, ok, err } from '#src/shared/result.js'
import { DomainError, domainError } from '#src/shared/domain-error.js'
import { buildOrderItems, OrderItemInput } from '../domain/order.js'
import { OrderRepository, PersistedOrder } from '../ports/order-repository.js'

export type AmendOrderCommand = {
  customerId: string
  orderId: number
  items: OrderItemInput[]
}

export const amendOrderUseCase =
  (repository: OrderRepository) =>
  async (
    command: AmendOrderCommand,
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
          `Order is ${order.status} and can no longer be amended.`,
        ),
      )
    }

    const variantIds = command.items.map((item) => item.variantId)
    const [prices, stock] = await Promise.all([
      repository.getVariantPrices(variantIds),
      repository.getAvailableStock(variantIds),
    ])

    // The order already holds stock from the original placement; treat that
    // held quantity as still available so a customer may re-order the same
    // variant without being blocked by their own reservation.
    const held = new Map<number, number>()
    for (const item of order.items) {
      held.set(
        item.variant_id,
        (held.get(item.variant_id) ?? 0) + item.quantity,
      )
    }

    const built = buildOrderItems(
      command.items,
      (variantId) => prices.get(variantId),
      (variantId) => (stock.get(variantId) ?? 0) + (held.get(variantId) ?? 0),
    )

    if (built.kind === 'err') {
      return built
    }

    const persisted = await repository.amendOrder({
      orderId: command.orderId,
      items: built.value.items,
      totalAmount: built.value.totalAmount,
    })

    if (!persisted) {
      return err(
        domainError('CONFLICT', 'Order changed and can no longer be amended.'),
      )
    }

    return ok(persisted)
  }
