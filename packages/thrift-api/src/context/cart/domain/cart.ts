import { Result, ok, err } from '#src/shared/result.js'
import { DomainError, domainError } from '#src/shared/domain-error.js'

export const validateQuantity = (
  quantity: number,
  availableStock: number,
): Result<number, DomainError> => {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return err(
      domainError('INVALID_INPUT', 'Quantity must be a positive integer.'),
    )
  }
  if (availableStock < quantity) {
    return err(domainError('INVALID_INPUT', 'Not enough stock.'))
  }
  return ok(quantity)
}
