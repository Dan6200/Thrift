import { Result, ok, err } from '#src/shared/result.js'
import { DomainError, domainError } from '#src/shared/domain-error.js'
import { createOrder } from '../domain/order.js'
import { OrderRepository, PersistedOrder } from '../ports/order-repository.js'

export type CreateOrderCommand = {
  customerId: string
  storeId: number
  deliveryInfoId?: number
  items: { variantId: number; quantity: number }[]
}

export const createOrderUseCase =
  (repository: OrderRepository) =>
  async (
    command: CreateOrderCommand,
  ): Promise<Result<PersistedOrder, DomainError>> => {
    if (!(await repository.storeExists(command.storeId))) {
      return err(domainError('NOT_FOUND', 'Store not found.'))
    }

    if (
      command.deliveryInfoId !== undefined &&
      !(await repository.deliveryInfoBelongsTo(
        command.deliveryInfoId,
        command.customerId,
      ))
    ) {
      return err(domainError('INVALID_INPUT', 'Invalid delivery information.'))
    }

    const variantIds = command.items.map((item) => item.variantId)
    const [prices, stock] = await Promise.all([
      repository.getVariantPrices(variantIds),
      repository.getAvailableStock(variantIds),
    ])

    const orderResult = createOrder(
      {
        customerId: command.customerId,
        storeId: command.storeId,
        deliveryInfoId: command.deliveryInfoId,
        items: command.items,
      },
      (variantId) => prices.get(variantId),
      (variantId) => stock.get(variantId) ?? 0,
    )

    if (orderResult.kind === 'err') {
      return orderResult
    }

    const persisted = await repository.create({ order: orderResult.value })
    return ok(persisted)
  }
