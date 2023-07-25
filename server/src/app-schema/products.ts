import joi from 'joi'

const ProductSchemaReq = joi
  .object({
    title: joi.string().required(),
    category: joi.string().required(),
    description: joi.array().items(joi.string().required()),
    list_price: joi.number().required(),
    net_price: joi.number().required(),
    quantity_available: joi.number().required(),
  })
  .required()

const ProductSchemaDBID = joi
  .object({
    product_id: joi.number().required(),
  })
  .required()

const ProductSchemaDB = joi
  .object({
    product_id: joi.number().required(),
    title: joi.string().required(),
    category: joi.string().allow(null),
    description: joi.array().items(joi.string()).allow(null),
    list_price: joi.number().required(),
    net_price: joi.number().required(),
    quantity_available: joi.number().required(),
    store_id: joi.number().required(),
    vendor_id: joi.number().required(),
    media: joi.array().allow(null),
    created_at: joi
      .alternatives()
      .try(joi.date().required(), joi.string().required()),
  })
  .required()

const ProductSchemaDBList = joi
  .object({
    products: joi
      .array()
      .items(
        joi.object({
          product_id: joi.number().required(),
          title: joi.string().required(),
          category: joi.string().allow(null),
          description: joi.array().items(joi.string()).allow(null),
          list_price: joi.number().required(),
          net_price: joi.number().required(),
          quantity_available: joi.number().required(),
          store_id: joi.number().required(),
          vendor_id: joi.number().required(),
          media: joi.array().allow(null),
          created_at: joi
            .alternatives()
            .try(joi.date().required(), joi.string().required()),
        })
      )
      .required(),
    total_products: joi.number().required(),
  })
  .required()

export {
  ProductSchemaReq,
  ProductSchemaDB,
  ProductSchemaDBList,
  ProductSchemaDBID,
}
