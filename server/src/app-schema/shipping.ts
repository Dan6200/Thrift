// cspell:ignore alphanum
import joi from 'joi'

export const ShippingInfoRequestSchema = joi
  .object({
    recipient_first_name: joi.string().alphanum().min(3).max(30).required(),
    recipient_last_name: joi.string().alphanum().min(3).max(30).required(),
    address: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().required(),
    postal_code: joi.string().required(),
    country: joi.string().required(),
    delivery_contact: joi
      .string()
      .pattern(
        /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
      )
      .required(),
    delivery_instructions: joi.string().required(),
  })
  .required()

export const ShippingInfoSchemaID = joi
  .object({
    shipping_info_id: joi.number().required(),
  })
  .required()

export const ShippingInfoResponseSchema = joi
  .object({
    shipping_info_id: joi.number().required(),
    customer_id: joi.number().required(),
    recipient_first_name: joi.string().alphanum().min(3).max(30).required(),
    recipient_last_name: joi.string().alphanum().min(3).max(30).required(),
    address: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().required(),
    postal_code: joi.string().required(),
    country: joi.string().required(),
    delivery_contact: joi
      .string()
      .pattern(
        /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
      )
      .required(),
    delivery_instructions: joi.string().required(),
  })
  .required()

export const ShippingInfoResponseListSchema = joi.array().items(
  joi
    .object({
      shipping_info_id: joi.number().required(),
      customer_id: joi.number().required(),
      recipient_first_name: joi.string().alphanum().min(3).max(30).required(),
      recipient_last_name: joi.string().alphanum().min(3).max(30).required(),
      address: joi.string().required(),
      city: joi.string().required(),
      state: joi.string().required(),
      postal_code: joi.string().required(),
      country: joi.string().required(),
      delivery_contact: joi
        .string()
        .pattern(
          /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
        )
        .required(),
      delivery_instructions: joi.string().required(),
    })
    .required()
)
