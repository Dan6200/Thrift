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

const ProductSchemaDB = joi
  .object({
    product_id: joi.string().required(),
    title: joi.string().required(),
    category: joi.string().required(),
    description: joi.string().required(),
    list_price: joi.number().required(),
    net_price: joi.number().required(),
    quantity_available: joi.number().required(),
    shop_id: joi.string().optional().allow(null),
    vendor_id: joi.string().required(),
  })
  .required();

export { ProductSchemaReq, ProductSchemaDB };
