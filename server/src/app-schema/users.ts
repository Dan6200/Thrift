import joi from 'joi';

const UserDataSchemaRequest = joi.object({
	first_name: joi.string().alphanum().min(3).max(30).required(),
	last_name: joi.string().alphanum().min(3).max(30).required(),
	email: joi
		.string()
		.pattern(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		)
		.required(),
	phone: joi
		.string()
		.pattern(
			/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
		)
		.required(),
	password: joi.string().required(),
	dob: joi.date().required(),
	country: joi.string(),
	is_vendor: joi.boolean().required(),
	is_customer: joi.boolean().required(),
	ip_address: joi.string(),
});

const UserDataSchemaDB = joi.object({
	first_name: joi.string().alphanum().min(3).max(30).required(),
	last_name: joi.string().alphanum().min(3).max(30).required(),
	email: joi
		.string()
		.pattern(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		)
		.required(),
	phone: joi
		.string()
		.pattern(
			/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
		)
		.required(),
	password: joi.binary().required(),
	dob: joi.date().required(),
	country: joi.string(),
	is_vendor: joi.boolean().required(),
	is_customer: joi.boolean().required(),
	ip_address: joi.string(),
});

const UserDataSchemaResJSON = joi.object({
	first_name: joi.string().alphanum().min(3).max(30).required(),
	last_name: joi.string().alphanum().min(3).max(30).required(),
	email: joi
		.string()
		.pattern(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		)
		.required(),
	phone: joi
		.string()
		.pattern(
			/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
		)
		.required(),
	password: joi.object({
		type: joi.string().required(),
		data: joi.array().items(joi.number().integer().required()).required(),
	}),
	dob: joi.string().required(),
	country: joi.string(),
	is_vendor: joi.boolean().required(),
	is_customer: joi.boolean().required(),
	ip_address: joi.string(),
});

export { UserDataSchemaRequest, UserDataSchemaDB, UserDataSchemaResJSON };
