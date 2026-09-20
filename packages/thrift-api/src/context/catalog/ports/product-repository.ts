import { Product, Variant } from '../domain/product.js'
import { VariantUpdate } from '../domain/variant.js'

export type PersistedVariantOption = {
  option_id: number
  option_value_id: number
  option_name: string
  value: string
}

export type PersistedVariant = {
  variant_id: number
  sku: string
  base_price: number
  quantity_available: number
  options: PersistedVariantOption[]
  created_at: string
  updated_at: string
}

export type PersistedProduct = {
  product_id: number
  title: string
  description: string[]
  vendor_id: string
  store_id: number
  category_id: number
  subcategory_id: number
  created_at: string
  updated_at: string
  variants: PersistedVariant[]
}

export type CreateProductInput = {
  product: Product
  vendorId: string
  storeId: number
}

export type GetAllProductsQuery = {
  vendorId?: string
  storeId?: number
  sort?: string
  limit?: number
  offset?: number
}

export type GetProductQuery = {
  productId: number
  vendorId?: string
  storeId?: number
}

export type UpdateProductData = {
  title?: string
  categoryId?: number
  subcategoryId?: number
  description?: string[]
}

export type UpdateProductCommand = {
  productId: number
  storeId: number
  vendorId: string
  data: UpdateProductData
}

export type RemoveProductCommand = {
  productId: number
  storeId: number
  vendorId: string
}

export type CreateVariantInput = {
  productId: number
  storeId: number
  variant: Variant
}

export type UpdateVariantInput = {
  productId: number
  variantId: number
  storeId: number
  changes: VariantUpdate
}

export type RemoveVariantInput = {
  productId: number
  variantId: number
  storeId: number
}

export type ProductRepository = {
  create(input: CreateProductInput): Promise<PersistedProduct>
  getAll(query: GetAllProductsQuery): Promise<unknown>
  getById(query: GetProductQuery): Promise<unknown>
  update(command: UpdateProductCommand): Promise<PersistedProduct>
  remove(command: RemoveProductCommand): Promise<void>
  createVariant(input: CreateVariantInput): Promise<PersistedVariant>
  updateVariant(input: UpdateVariantInput): Promise<PersistedVariant>
  removeVariant(input: RemoveVariantInput): Promise<void>
}
