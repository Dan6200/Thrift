import { Result, ok, err } from '#src/shared/result.js'
import { DomainError, domainError } from '#src/shared/domain-error.js'
import { Variant, VariantOption } from './product.js'
import { isNonNegativeMoney } from '#src/shared/money.js'

export type VariantUpdate = {
  sku?: string
  basePrice?: number
  quantityAvailable?: number
  inventoryChangeReason?: string
  inventoryChangeNotes?: string
  options?: VariantOption[]
}

export const createVariant = (
  variant: Variant,
): Result<Variant, DomainError> => {
  const sku = variant.sku.trim()
  if (!sku) {
    return err(domainError('INVALID_INPUT', 'Every variant must have an SKU.'))
  }
  if (!isNonNegativeMoney(variant.basePrice)) {
    return err(
      domainError(
        'INVALID_INPUT',
        `Variant "${sku}" must have a non-negative integer base price (kobo).`,
      ),
    )
  }
  if (
    !Number.isInteger(variant.quantityAvailable) ||
    variant.quantityAvailable < 0
  ) {
    return err(
      domainError(
        'INVALID_INPUT',
        `Variant "${sku}" must have a non-negative quantity.`,
      ),
    )
  }
  if (variant.options.length === 0) {
    return err(
      domainError(
        'INVALID_INPUT',
        `Variant "${sku}" must have at least one option.`,
      ),
    )
  }
  return ok({ ...variant, sku })
}

export const validateVariantUpdate = (
  update: VariantUpdate,
): Result<VariantUpdate, DomainError> => {
  if (update.basePrice !== undefined && !isNonNegativeMoney(update.basePrice)) {
    return err(
      domainError(
        'INVALID_INPUT',
        'Base price must be a non-negative integer (kobo).',
      ),
    )
  }
  if (
    update.quantityAvailable !== undefined &&
    (!Number.isInteger(update.quantityAvailable) ||
      update.quantityAvailable < 0)
  ) {
    return err(
      domainError('INVALID_INPUT', 'Quantity must be a non-negative integer.'),
    )
  }
  if (update.quantityAvailable !== undefined && !update.inventoryChangeReason) {
    return err(
      domainError(
        'INVALID_INPUT',
        'Inventory change reason is required when updating quantity.',
      ),
    )
  }
  return ok(update)
}
