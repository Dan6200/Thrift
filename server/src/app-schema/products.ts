import joi from "joi";

const ProductSchemaReq = joi
  .object({
    title: joi.string().required(),
    category: joi.string().required(),
    description: joi.string().required(),
    list_price: joi.number().required(),
    net_price: joi.number().required(),
    quantity_available: joi.number().required(),
  })
  .required();

const ProductSchemaUpdateReq = joi
  .object({
    title: joi.string(),
    category: joi.string(),
    description: joi.string(),
    list_price: joi.number(),
    net_price: joi.number(),
    quantity_available: joi.number(),
  })
  .required();

const ProductSchemaDB = joi
  .object({
    product_id: joi.string().required(),
    title: joi.string().required(),
    category: joi.string().required(),
    description: joi.string().required(),
    list_price: joi.number().required(),
    net_price: joi.number().required(),
    quantity_available: joi.number().required(),
    store_id: joi.string().required(),
    vendor_id: joi.string().required(),
    media: joi.object().allow(null),
    list_date: joi
      .alternatives()
      .try(joi.date().required(), joi.string().required()),
  })
  .required();

export { ProductSchemaReq, ProductSchemaUpdateReq, ProductSchemaDB };
