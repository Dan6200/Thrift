export type VariantOption = {
  option_id: number
  option_name: string
  option_value_id: number
  value: string
  created_at?: Date
  updated_at?: Date
}

export type ProductVariant = {
  variant_id: number
  sku: string
  base_price: number
  quantity_available: number
  options: VariantOption[]
  created_at?: Date
  updated_at?: Date
}

export type ProductResponseData = {
  product_id: number
  vendor_id: string
  title: string
  category_id: number
  subcategory_id: number
  description: string[]
  variants?: ProductVariant[]
  media?: ProductMedia[]
  created_at?: Date
  updated_at?: Date
}

export type RequestVariantOption = {
  option_name: string
  value: string
}

export type RequestVariant = {
  sku: string
  base_price: number
  quantity_available: number
  options: RequestVariantOption[]
}

export type UpdateRequestVariant = {
  sku?: string
  base_price?: number
  quantity_available?: number
  inventory_change_reason?: string
  inventory_change_notes?: string
  options?: RequestVariantOption[]
}

export type ProductRequestData = {
  title: string
  category_id: number
  subcategory_id: number
  description: string[]
  variants?: RequestVariant[]
}

export type UpdateProductRequestData = {
  title?: string
  category_id?: number
  subcategory_id?: number
  description?: string[]
  variants?: UpdateRequestVariant[]
}

import { MediaType } from './media.js'

export type ProductMediaUpload = {
  name: string
  path: string
  description: string
  is_display_image: boolean
  is_thumbnail_image: boolean
  filetype:
    | 'image/jpeg'
    | 'image/jpg'
    | 'image/png'
    | 'video/mp4'
    | 'video/webp'
    | 'image/webp'
    | 'video/mkv'
}

export type ProductMedia = MediaType & {
  is_display_image: boolean
  is_thumbnail_image: boolean
}

export interface ProductID {
  product_id: number
}

export interface VariantID {
  variant_id: number
}

export interface ProductVariantRequest {
  body: RequestVariant
  params: { productId: number }
  query: { store_id: number }
}

export interface ProductVariantUpdateRequest {
  body: UpdateRequestVariant
  params: { productId: number; variantId: number }
  query: { store_id: number }
}

export interface ProductVariantDeleteRequest {
  params: { productId: number; variantId: number }
  query: { store_id: number }
}
