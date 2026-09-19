import { Result } from '#src/shared/result.js'
import { DomainError } from '#src/shared/domain-error.js'
import { createProduct, Variant } from '../domain/product.js'
import {
  ProductRepository,
  PersistedProduct,
} from '../ports/product-repository.js'

export type CreateProductCommand = {
  title: string
  categoryId: number
  subcategoryId: number
  description: string[]
  variants: Variant[]
  vendorId: string
  storeId: number
}

export const createProductUseCase =
  (repository: ProductRepository) =>
  async (
    command: CreateProductCommand,
  ): Promise<Result<PersistedProduct, DomainError>> => {
    const productResult = createProduct({
      title: command.title,
      categoryId: command.categoryId,
      subcategoryId: command.subcategoryId,
      description: command.description,
      variants: command.variants,
    })

    if (productResult.kind === 'err') {
      return productResult
    }

    const persisted = await repository.create({
      product: productResult.value,
      vendorId: command.vendorId,
      storeId: command.storeId,
    })

    return { kind: 'ok', value: persisted }
  }
