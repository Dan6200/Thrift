import joi from 'joi'
import {
  RequestVariantSchema,
  UpdateRequestVariantSchema,
  VariantOptionSchema,
} from './variants.js'
import { ProductMediaResponseSchema } from '../media/products.js'

export const ProductVariantResponseSchema = joi.object({
  variant_id: joi.number().required(),
  sku: joi.string().required(),
  base_price: joi.number().integer().min(0).required(),
  quantity_available: joi.number().required(),
  options: joi.array().items(VariantOptionSchema).required(),
  created_at: joi.date().required(),
  updated_at: joi.date().required(),
})

// Base Schemas
export const ProductUpdateDataSchema = joi.object({
  title: joi.string().optional(),
  category_id: joi.number().optional(),
  subcategory_id: joi.number().optional(),
  description: joi.array().items(joi.string()).optional(),
  variants: joi.array().items(UpdateRequestVariantSchema).optional(),
})

export const ProductCreateDataSchema = joi.object({
  title: joi.string().required(),
  category_id: joi.number().required(),
  subcategory_id: joi.number().required(),
  description: joi.array().items(joi.string()),
  variants: joi.array().items(RequestVariantSchema).min(1).required(),
})

// Request Schemas
export const ProductCreateRequestSchema = joi.object({
  body: ProductCreateDataSchema.required(),
  query: joi
    .object({ storeId: joi.number().integer().positive().required() })
    .required(),
  params: joi.object().optional(),
})

export const ProductUpdateRequestSchema = joi.object({
  params: joi
    .object({ productId: joi.number().integer().positive().required() })
    .required(),
  query: joi
    .object({ storeId: joi.number().integer().positive().required() })
    .required(),
  body: ProductUpdateDataSchema.required(),
})

export const ProductDeleteRequestSchema = joi.object({
  params: joi
    .object({ productId: joi.number().integer().positive().required() })
    .required(),
  query: joi
    .object({ storeId: joi.number().integer().positive().required() })
    .required(),
  body: joi.object().optional(),
})

export const ProductGetRequestSchema = joi.object({
  params: joi
    .object({ productId: joi.number().integer().positive().required() })
    .required(),
  query: joi
    .object({ storeId: joi.number().integer().positive().optional() })
    .required(),
  body: joi.object().optional(),
})

export const ProductGetAllRequestSchema = joi.object({
  query: joi
    .object({
      storeId: joi.number().integer().positive().optional(),
      category: joi.string().optional(),
      subcategory: joi.string().optional(),
      min_price: joi.number().positive().optional(),
      max_price: joi.number().positive().optional(),
      sort: joi.string().optional(),
      order: joi.string().valid('asc', 'desc').optional(),
      offset: joi.number().integer().min(0).optional(),
      limit: joi.number().integer().min(1).optional(),
    })
    .required(),
  params: joi.object().optional(),
  body: joi.object().optional(),
})

// Response Schemas
// export const ProductIdSchema = joi.object({
//   product_id: joi.number().required(),
// }).required()

export const ProductResponseSchema = joi
  .object({
    product_id: joi.number().required(),
    title: joi.string().required(),
    category_id: joi.number().required(),
    subcategory_id: joi.number().required(),
    description: joi.array().items(joi.string()),
    vendor_id: joi.string().guid({ version: 'uuidv4' }).required(),
    store_id: joi.number().required(),
    created_at: joi.date().required(),
    updated_at: joi.date().required(),
    variants: joi.array().items(ProductVariantResponseSchema).allow(null),
  })
  .required()

export const ProductGETResponseSchema = joi
  .object({
    product_id: joi.number().required(),
    title: joi.string().required(),
    category_id: joi.number().required(),
    category_name: joi.string().required(),
    subcategory_id: joi.number().required(),
    subcategory_name: joi.string().required(),
    description: joi.array().items(joi.string()),
    products_sold: joi.number().required(),
    average_rating: joi.number().allow(null).required(),
    review_count: joi.number().allow(null).required(),
    vendor_id: joi.string().guid({ version: 'uuidv4' }).required(),
    store_id: joi.number().required(),
    media: joi.array().items(ProductMediaResponseSchema).allow(null),
    variants: joi.array().items(ProductVariantResponseSchema).allow(null),
    created_at: joi.date().required(),
    updated_at: joi.date().required(),
  })
  .required()

export const ProductGETAllResponseSchema = joi
  .object({
    products: joi.array().items(ProductGETResponseSchema).allow(null),
    total_count: joi.number().required(),
  })
  .required()
