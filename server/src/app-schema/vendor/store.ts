import joi from "joi";

const StoreSchemaReq = joi
  .object({
    store_name: joi.string().min(3).max(50).required(),
    banner_image_path: joi.string(),
  })
  .required();

const StoreSchemaDB = joi
  .object({
    store_id: joi.string().pattern(/\d+/).required(),
    store_name: joi.string().min(3).max(50).required(),
    vendor_id: joi.number().required(),
    date_created: joi
      .alternatives()
      .try(joi.string().required(), joi.date().required()),
    banner_image_path: joi.string(),
  })
  .required();

export { StoreSchemaReq, StoreSchemaDB };
