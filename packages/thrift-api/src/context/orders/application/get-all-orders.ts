import { Result, ok, err } from '#src/shared/result.js'
import { DomainError, domainError } from '#src/shared/domain-error.js'
import { OrderRepository } from '../ports/order-repository.js'

export type GetAllOrdersCommand = {
  userId: string
  storeId?: number
}

export const getAllOrdersUseCase =
  (repository: OrderRepository) =>
  async (
    command: GetAllOrdersCommand,
  ): Promise<Result<unknown, DomainError>> => {
    const profile = await repository.getProfile(command.userId)
    if (!profile) {
      return err(domainError('NOT_FOUND', 'User profile not found.'))
    }

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
        return ok(await repository.getAllOrders({ store_id: command.storeId }))
      }
      return ok(
        await repository.getAllOrders({
          customer_id: command.userId,
          store_id: command.storeId,
        }),
      )
    }

    return ok(await repository.getAllOrders({ customer_id: command.userId }))
  }
