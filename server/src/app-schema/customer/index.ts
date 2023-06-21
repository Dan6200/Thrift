import Joi from 'joi'

export const CustomerDBResultSchema = Joi.object({
	customer_id: Joi.string().pattern(/\d+/).required(),
}).required()
