import joi from 'joi'

const StoreSchemaReq = joi
  .object({
    store_name: joi.string().min(3).max(50).required(),
    store_page: joi.object().required(),
  })
  .required()

const UpdateStoreSchemaReq = joi
  .object({
    store_name: joi.string().min(3).max(50),
    store_page: joi.object(),
  })
  .required()

const StoreSchemaDB = joi
  .object({
    store_id: joi.string().pattern(/\d+/).required(),
    store_name: joi.string().min(3).max(50).required(),
    vendor_id: joi.number().required(),
    store_page: joi.object().required(),
    date_created: joi
      .alternatives()
      .try(joi.string().required(), joi.date().required()),
  })
  .required()

export { StoreSchemaReq, StoreSchemaDB, UpdateStoreSchemaReq }
