import { Result, ok, err } from '#src/shared/result.js'
import { DomainError, domainError } from '#src/shared/domain-error.js'
import { Money } from '#src/shared/money.js'

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'failed'
  | 'cancelled'
  | 'shipped'
  | 'delivered'
  | 'refunded'

export type OrderItemInput = {
  variantId: number
  quantity: number
}

export type OrderItem = {
  variantId: number
  quantity: number
  priceAtPurchase: Money
}

export type OrderDraft = {
  customerId: string
  storeId: number
  deliveryInfoId?: number
  items: OrderItemInput[]
}

export type Order = {
  customerId: string
  storeId: number
  deliveryInfoId?: number
  totalAmount: Money
  items: OrderItem[]
  status: OrderStatus
}

export type VariantPrice = (variantId: number) => Money | undefined
export type AvailableStock = (variantId: number) => number

export type BuiltOrderItems = {
  items: OrderItem[]
  totalAmount: Money
}

export const buildOrderItems = (
  items: OrderItemInput[],
  priceOf: VariantPrice,
  stockOf: AvailableStock,
): Result<BuiltOrderItems, DomainError> => {
  if (items.length === 0) {
    return err(
      domainError('INVALID_INPUT', 'An order must have at least one item.'),
    )
  }

  let totalAmount = 0
  const built: OrderItem[] = []

  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      return err(
        domainError(
          'INVALID_INPUT',
          'Item quantity must be a positive integer.',
        ),
      )
    }

    const price = priceOf(item.variantId)
    if (price === undefined) {
      return err(
        domainError(
          'INVALID_INPUT',
          `Variant ${item.variantId} does not exist.`,
        ),
      )
    }

    const stock = stockOf(item.variantId)
    if (stock < item.quantity) {
      return err(
        domainError(
          'INVALID_INPUT',
          `Not enough stock for variant ${item.variantId}.`,
        ),
      )
    }

    built.push({
      variantId: item.variantId,
      quantity: item.quantity,
      priceAtPurchase: price,
    })
    totalAmount += price * item.quantity
  }

  return ok({ items: built, totalAmount })
}

export const createOrder = (
  draft: OrderDraft,
  priceOf: VariantPrice,
  stockOf: AvailableStock,
): Result<Order, DomainError> => {
  const built = buildOrderItems(draft.items, priceOf, stockOf)
  if (built.kind === 'err') {
    return built
  }

  return ok({
    customerId: draft.customerId,
    storeId: draft.storeId,
    deliveryInfoId: draft.deliveryInfoId,
    totalAmount: built.value.totalAmount,
    items: built.value.items,
    status: 'pending',
  })
}
