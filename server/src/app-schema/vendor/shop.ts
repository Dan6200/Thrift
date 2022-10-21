import joi from 'joi';

const ShopSchemaReq = joi
	.object({
		shop_name: joi.string().min(3).max(50).required(),
		banner_image_path: joi.string(),
	})
	.required();

const ShopSchemaDB = joi
	.object({
		shop_id: joi.string().pattern(/\d+/).required(),
		shop_name: joi.string().min(3).max(50).required(),
		vendor_id: joi.number().required(),
		date_created: joi
			.alternatives()
			.try(joi.string().required(), joi.date().required()),
		banner_image_path: joi.string(),
	})
	.required();

export { ShopSchemaReq, ShopSchemaDB };
