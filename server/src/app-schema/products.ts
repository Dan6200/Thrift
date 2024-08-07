import joi from 'joi'

export const ProductRequestSchema = joi
  .object({
    title: joi.string().required(),
    category_id: joi.number().required(),
    subcategory_id: joi.number().required(),
    description: joi.array().items(joi.string().required()),
    list_price: joi.number().required(),
    net_price: joi.number().required(),
    quantity_available: joi.number().required(),
  })
  .required()

export const ProductIdSchema = joi
  .object({
    product_id: joi.number().required(),
  })
  .required()

export const ProductResponseSchema = joi
  .object({
    product_id: joi.number().required(),
    title: joi.string().required(),
    category_id: joi.number().required(),
    category_name: joi.string().required(),
    subcategory_id: joi.number().required(),
    subcategory_name: joi.string().required(),
    description: joi.array().items(joi.string()).allow(null),
    list_price: joi.number().required(),
    net_price: joi.number().required(),
    quantity_available: joi.number().required(),
    vendor_id: joi.string().required(),
    media: joi.array().allow(null),
    created_at: joi
      .alternatives()
      .try(joi.date().required(), joi.string().required()),
  })
  .required()

export const ProductListResponseSchema = joi
  .object({
    products: joi
      .array()
      .items(
        joi.object({
          product_id: joi.number().required(),
          title: joi.string().required(),
          category_id: joi.number().required(),
          category_name: joi.string().required(),
          subcategory_id: joi.number().required(),
          subcategory_name: joi.string().required(),
          description: joi.array().items(joi.string()).allow(null),
          list_price: joi.number().required(),
          net_price: joi.number().required(),
          quantity_available: joi.number().required(),
          vendor_id: joi.string().required(),
          media: joi.array().allow(null),
          created_at: joi
            .alternatives()
            .try(joi.date().required(), joi.string().required()),
        })
      )
      .allow(null),
    total_products: joi.number().required(),
  })
  .required()
