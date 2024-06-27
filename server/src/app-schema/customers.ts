import joi from 'joi'

export const CustomerSchemaID = joi.object({
  customer_id: joi.string().alphanum().min(1).max(128),
})
