import { Result, ok, err } from '#src/shared/result.js'
import { DomainError, domainError } from '#src/shared/domain-error.js'
import { OrderRepository } from '../ports/order-repository.js'

export type GetOrderCommand = {
  userId: string
  orderId: number
  storeId?: number
}

export const getOrderUseCase =
  (repository: OrderRepository) =>
  async (command: GetOrderCommand): Promise<Result<unknown, DomainError>> => {
    const profile = await repository.getProfile(command.userId)
    if (!profile) {
      return err(domainError('NOT_FOUND', 'User profile not found.'))
    }

    let order: unknown
    if (command.storeId) {
      if (profile.is_vendor) {
        const hasAccess = await repository.hasStoreAccess(
          command.userId,
          command.storeId,
          ['admin', 'editor'],
        )
        if (!hasAccess) {
          return err(
            domainError(
              'UNAUTHORIZED',
              "Access denied to this store's orders.",
            ),
          )
        }
        order = await repository.getOrderById({
          order_id: command.orderId,
          store_id: command.storeId,
        })
      } else {
        order = await repository.getOrderById({
          order_id: command.orderId,
          customer_id: command.userId,
          store_id: command.storeId,
        })
      }
    } else {
      order = await repository.getOrderById({
        order_id: command.orderId,
        customer_id: command.userId,
      })
    }

    if (!order) {
      return err(domainError('NOT_FOUND', 'Order not found.'))
    }

    return ok(order)
  }
