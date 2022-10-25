import joi from 'joi';

const UserDataSchemaRequest = joi
	.object({
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
		ip_address: joi.string(),
	})
	.required();

const UserDataSchemaDB = joi
	.object({
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
		dob: joi
			.alternatives()
			.try(joi.date().required(), joi.string().required()),
		country: joi.string(),
		ip_address: joi.string(),
	})
	.required();

export { UserDataSchemaRequest, UserDataSchemaDB };
