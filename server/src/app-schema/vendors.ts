import joi from 'joi'

export const VendorSchemaID = joi.object({
  vendor_id: joi.string().alphanum().min(1).max(128),
})
