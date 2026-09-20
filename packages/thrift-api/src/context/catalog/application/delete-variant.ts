import {
  ProductRepository,
  RemoveVariantInput,
} from '../ports/product-repository.js'

export const deleteVariantUseCase =
  (repository: ProductRepository) => (input: RemoveVariantInput) =>
    repository.removeVariant(input)
