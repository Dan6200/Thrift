import joi from 'joi';

const ShippingInfoSchema = joi.object({
	recepient_first_name: joi.string().alphanum().min(3).max(30).required(),
	recepient_last_name: joi.string().alphanum().min(3).max(30).required(),
	street: joi.string().required(),
	postal_code: joi.string().required(),
	delivery_contact: joi
		.string()
		.pattern(
			/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
		)
		.required(),
	delivery_instructions: joi.string().required(),
	is_primary: joi.boolean().required(),
});

export { ShippingInfoSchema };
