import { Result } from '#src/shared/result.js'
import { DomainError } from '#src/shared/domain-error.js'
import { Variant } from '../domain/product.js'
import { createVariant } from '../domain/variant.js'
import {
  ProductRepository,
  PersistedVariant,
} from '../ports/product-repository.js'

export type CreateVariantCommand = {
  productId: number
  storeId: number
  variant: Variant
}

export const createVariantUseCase =
  (repository: ProductRepository) =>
  async (
    command: CreateVariantCommand,
  ): Promise<Result<PersistedVariant, DomainError>> => {
    const variantResult = createVariant(command.variant)
    if (variantResult.kind === 'err') {
      return variantResult
    }

    const persisted = await repository.createVariant({
      productId: command.productId,
      storeId: command.storeId,
      variant: variantResult.value,
    })

    return { kind: 'ok', value: persisted }
  }
