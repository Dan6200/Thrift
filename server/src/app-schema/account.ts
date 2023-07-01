// Purpose: Joi schema for account data
// cspell:ignore alphanum
import joi from 'joi'

const AccountDataSchemaRequest = joi
	.object()
	.keys({
		first_name: joi.string().alphanum().min(3).max(30).required(),
		last_name: joi.string().alphanum().min(3).max(30).required(),
		email: joi
			.string()
			.pattern(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
			.allow(''),
		phone: joi
			.string()
			.pattern(
				/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
			)
			.allow(''),
		password: joi.string().required(),
		dob: joi.date().required(),
		country: joi.string().required(),
	})
	.or('email', 'phone')
	.required()

const AccountDataSchemaDB = joi
	.object()
	.keys({
		first_name: joi.string().alphanum().min(3).max(30).required(),
		last_name: joi.string().alphanum().min(3).max(30).required(),
		email: joi
			.string()
			.pattern(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
			.allow(''),
		phone: joi
			.string()
			.pattern(
				/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
			)
			.allow(''),
		dob: joi.alternatives().try(joi.date().required(), joi.string().required()),
		country: joi.string().required(),
		is_customer: joi.boolean().required(),
		is_vendor: joi.boolean().required(),
	})
	.or('email', 'phone')
	.required()

export { AccountDataSchemaRequest, AccountDataSchemaDB }
