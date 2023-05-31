import joi from "joi";

const ShippingInfoSchemaReq = joi
  .object({
    recipient_first_name: joi.string().alphanum().min(3).max(30).required(),
    recipient_last_name: joi.string().alphanum().min(3).max(30).required(),
    street: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().required(),
    postal_code: joi.string().required(),
    delivery_contact: joi
      .string()
      .pattern(
        /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
      )
      .required(),
    delivery_instructions: joi.string().required(),
  })
  .required();

const ShippingInfoSchemaDB = joi
  .object({
    address_id: joi.string().required(),
    recipient_first_name: joi.string().alphanum().min(3).max(30).required(),
    recipient_last_name: joi.string().alphanum().min(3).max(30).required(),
    street: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().required(),
    postal_code: joi.string().required(),
    delivery_contact: joi
      .string()
      .pattern(
        /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
      )
      .required(),
    delivery_instructions: joi.string().required(),
  })
  .required();

export { ShippingInfoSchemaReq, ShippingInfoSchemaDB };
