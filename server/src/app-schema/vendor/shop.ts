import joi from 'joi';

const ShopSchema = joi.object({
	shop_name: joi.string().alphanum().min(3).max(50).required(),
	vendor_id: joi.string().alphanum().pattern(/\d+/).required(),
	banner_image_path: joi.string(),
});

export { ShopSchema };
