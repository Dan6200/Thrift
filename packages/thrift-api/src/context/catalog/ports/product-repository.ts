import { Product } from '../domain/product.js'

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

export type ProductRepository = {
  create(input: CreateProductInput): Promise<PersistedProduct>
}
