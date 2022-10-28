import joi from 'joi';

const ProductSchemaReq = joi
	.object({
		title: joi.string().min(3).max(50).required(),
		category: joi.string().min(3).max(100).required(),
		description: joi.string().max(1000),
		list_price: joi.number().required(),
		shop_id: joi.string(),
		quantity_available: joi.number().required(),
	})
	.required();

const ProductSchemaDB = joi
	.object({
		product_id: joi.string().required(),
		title: joi.string().min(3).max(50).required(),
		category: joi.string().min(3).max(100).required(),
		description: joi.string().max(1000),
		list_price: joi.number().required(),
		shop_id: joi.string().required(),
		quantity_available: joi.number().required(),
	})
	.required();

export { ProductSchemaReq, ProductSchemaDB };
