import { Result } from '#src/shared/result.js'
import { DomainError } from '#src/shared/domain-error.js'
import { validateVariantUpdate } from '../domain/variant.js'
import {
  ProductRepository,
  PersistedVariant,
  UpdateVariantInput,
} from '../ports/product-repository.js'

export const updateVariantUseCase =
  (repository: ProductRepository) =>
  async (
    input: UpdateVariantInput,
  ): Promise<Result<PersistedVariant, DomainError>> => {
    const changesResult = validateVariantUpdate(input.changes)
    if (changesResult.kind === 'err') {
      return changesResult
    }

    const persisted = await repository.updateVariant({
      ...input,
      changes: changesResult.value,
    })

    return { kind: 'ok', value: persisted }
  }
