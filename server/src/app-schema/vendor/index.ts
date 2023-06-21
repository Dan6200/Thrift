import Joi from 'joi'

export const VendorDBResultSchema = Joi.object({
	vendor_id: Joi.string().pattern(/\d+/).required(),
}).required()
