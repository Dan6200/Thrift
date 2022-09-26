import joi from 'joi';

const ShopSchemaReq = joi.object({
	shop_name: joi.string().alphanum().min(3).max(50).required(),
	date_created: joi
		.alternatives()
		.try(joi.string().required(), joi.date().required()),
	banner_image_path: joi.string(),
});

const ShopSchemaDB = joi.object({
	shop_id: joi.string().pattern(/d+/).required(),
	shop_name: joi.string().alphanum().min(3).max(50).required(),
	date_created: joi
		.alternatives()
		.try(joi.string().required(), joi.date().required()),
	banner_image_path: joi.string(),
});

export { ShopSchemaReq, ShopSchemaDB };
