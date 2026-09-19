import joi from 'joi'

// Base Schemas
export const VariantOptionSchema = joi.object({
  option_id: joi.number().required(),
  option_name: joi.string().required(),
  option_value_id: joi.number().required(),
  value: joi.string().required(),
})

export const RequestVariantOptionSchema = joi.object({
  option_name: joi.string().uppercase().required(),
  value: joi.string().uppercase().required(),
})

export const RequestVariantSchema = joi.object({
  sku: joi.string().required(),
  base_price: joi.number().integer().min(0).required(),
  quantity_available: joi.number().required(),
  options: joi.array().items(RequestVariantOptionSchema).min(1).required(),
})

export const UpdateRequestVariantSchema = joi.object({
  sku: joi.string().optional(),
  base_price: joi.number().integer().min(0).optional(),
  quantity_available: joi.number().optional(),
  inventory_change_reason: joi.string().when('quantity_available', {
    is: joi.exist(),
    then: joi.required(),
    otherwise: joi.optional(),
  }),
  inventory_change_notes: joi.string().optional(),
  options: joi.array().items(RequestVariantOptionSchema).min(1).optional(),
})

export const VariantResponseSchema = joi.object({
  variant_id: joi.number().required(),
  product_id: joi.number().required(),
  sku: joi.string().required(),
  base_price: joi.number().integer().min(0).required(),
  quantity_available: joi.number().required(),
  options: joi.array().items(VariantOptionSchema).required(),
  created_at: joi.date().required(),
  updated_at: joi.date().required(),
})

// Request Schemas
export const ProductVariantCreateRequestSchema = joi.object({
  body: RequestVariantSchema.required(),
  params: joi
    .object({
      productId: joi.number().integer().positive().required(),
    })
    .required(),
  query: joi
    .object({
      storeId: joi.number().integer().positive().required(),
    })
    .required(),
})

export const ProductVariantUpdateRequestSchema = joi.object({
  body: UpdateRequestVariantSchema.required(),
  params: joi
    .object({
      productId: joi.number().integer().positive().required(),
      variantId: joi.number().integer().positive().required(),
    })
    .required(),
  query: joi
    .object({
      storeId: joi.number().integer().positive().required(),
    })
    .required(),
})

export const ProductVariantDeleteRequestSchema = joi.object({
  params: joi
    .object({
      productId: joi.number().integer().positive().required(),
      variantId: joi.number().integer().positive().required(),
    })
    .required(),
  query: joi
    .object({
      storeId: joi.number().integer().positive().required(),
    })
    .required(),
  body: joi.object().optional(),
})

export const ProductVariantResponseSchema = VariantResponseSchema
