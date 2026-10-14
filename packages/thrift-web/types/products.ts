import { z } from 'zod'

// Corresponds to the API's ProductMediaResponseSchema (app-schema/media/products.ts)
export const ImgDataSchema = z.object({
  media_id: z.coerce.number(),
  filename: z.string(),
  filepath: z.string(),
  filetype: z.string(),
  description: z.string().nullable(),
  uploader_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  is_display_image: z.boolean().optional(),
  is_thumbnail_image: z.boolean().optional(),
  variant_id: z.coerce.number(),
})

export type ImgData = z.infer<typeof ImgDataSchema>

// Corresponds to the API's VariantOptionSchema (app-schema/products/variants.ts)
export const VariantOptionSchema = z.object({
  option_id: z.coerce.number(),
  option_name: z.string(),
  option_value_id: z.coerce.number(),
  value: z.string(),
})

export type VariantOption = z.infer<typeof VariantOptionSchema>

// Corresponds to the API's ProductVariantResponseSchema
export const ProductVariantSchema = z.object({
  variant_id: z.coerce.number(),
  sku: z.string(),
  base_price: z.coerce.number().nonnegative(),
  quantity_available: z.coerce.number().nonnegative(),
  options: z.array(VariantOptionSchema),
  created_at: z.string(),
  updated_at: z.string(),
})

export type ProductVariant = z.infer<typeof ProductVariantSchema>

// Corresponds to the API's ProductGETResponseSchema
export const ProductSchema = z.object({
  product_id: z.coerce.number(),
  title: z.string().min(1, 'Product title cannot be empty'),
  category_id: z.coerce.number(),
  category_name: z.string(),
  subcategory_id: z.coerce.number(),
  subcategory_name: z.string(),
  description: z.array(z.string()).optional(),
  products_sold: z.coerce.number().optional(),
  average_rating: z.coerce.number().nullable().optional(),
  review_count: z.coerce.number().nullable().optional(),
  vendor_id: z.string(),
  store_id: z.coerce.number(),
  created_at: z.string(),
  updated_at: z.string(),
  media: z.array(ImgDataSchema).nullable().optional(),
  variants: z.array(ProductVariantSchema).nullable().optional(),
})

export type Product = z.infer<typeof ProductSchema>

// Corresponds to the API's ProductGETAllResponseSchema
export const ProductDataSchema = z.object({
  products: z.array(ProductSchema),
  total_count: z.coerce.number().int().min(0),
})

export type ProductData = z.infer<typeof ProductDataSchema>
