import { Result, ok, err } from '#src/shared/result.js'
import { DomainError, domainError } from '#src/shared/domain-error.js'
import { Money, isNonNegativeMoney } from '#src/shared/money.js'

export type VariantOption = {
  optionName: string
  value: string
}

export type Variant = {
  sku: string
  basePrice: Money
  quantityAvailable: number
  options: VariantOption[]
}

export type Product = {
  title: string
  categoryId: number
  subcategoryId: number
  description: string[]
  variants: Variant[]
}

export type ProductDraft = {
  title: string
  categoryId: number
  subcategoryId: number
  description: string[]
  variants: Variant[]
}

const nonEmptyString = (value: string): boolean => value.trim().length > 0

export const createProduct = (
  draft: ProductDraft,
): Result<Product, DomainError> => {
  if (!nonEmptyString(draft.title)) {
    return err(domainError('INVALID_INPUT', 'Product title is required.'))
  }
  if (!Number.isInteger(draft.categoryId) || draft.categoryId <= 0) {
    return err(
      domainError('INVALID_INPUT', 'Product must belong to a valid category.'),
    )
  }
  if (!Number.isInteger(draft.subcategoryId) || draft.subcategoryId <= 0) {
    return err(
      domainError(
        'INVALID_INPUT',
        'Product must belong to a valid subcategory.',
      ),
    )
  }
  if (draft.variants.length === 0) {
    return err(
      domainError('INVALID_INPUT', 'A product must have at least one variant.'),
    )
  }

  const skus = new Set<string>()
  const variants: Variant[] = []
  for (const variant of draft.variants) {
    const sku = variant.sku.trim()
    if (!nonEmptyString(sku)) {
      return err(
        domainError('INVALID_INPUT', 'Every variant must have an SKU.'),
      )
    }
    if (skus.has(sku)) {
      return err(
        domainError(
          'INVALID_INPUT',
          `Duplicate SKU "${sku}" in product variants.`,
        ),
      )
    }
    skus.add(sku)

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

    variants.push({
      sku,
      basePrice: variant.basePrice,
      quantityAvailable: variant.quantityAvailable,
      options: variant.options,
    })
  }

  return ok({
    title: draft.title,
    categoryId: draft.categoryId,
    subcategoryId: draft.subcategoryId,
    description: draft.description,
    variants,
  })
}
