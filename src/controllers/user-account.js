const db = require('../db'),
	 { StatusCodes } = require('http-status-codes'),
	 { BadRequestError, NotFoundError } = require('../errors/'),
	 { genSqlCommands } = require('./helper-functions'),
	 fileName = (require('path')).basename(__filename),
	 { hashPassword, validatePassword } = require('../security/password')

const getUserAccount = async (request, response) => {
	const { userId } = request.user,
		userAccount = (await db.query(
			`select 
				first_name,
				last_name,
				email,
				phone,
				ip_address,
				country,
				dob,
				is_vendor,
				is_customer
			from marketplace.user_account 
			where user_id = $1` 
		, [ userId ])).rows[0]
	if (!userAccount)
		throw new NotFoundError ('User cannot be found')
	response.status(StatusCodes.OK).json({
		userAccount 
	})
}

const updateUserAccount = async (request, response) => {
	const { userId } = request.user,
		 rawFields = Object.keys (request.body),
		 rawData = Object.values (request.body)
	if (!rawFields.length)
		throw new BadRequestError ('request data cannot be empty')
	// TODO: validate and verify updated email and phone numbers
	const { 
		old_password:	oldPassword,
		new_password:	newPassword	
	} = request.body

	if (oldPassword) {
		const { password } = (await db.query (
			`select password from marketplace.user_account
			where user_id = $1`,
			[ userId ])).rows[0]

		const pwdIsValid = await validatePassword(oldPassword,
			password.toString())

		if (!pwdIsValid)
			throw new UnauthenticatedError(`Invalid Credentials,
				cannot update password`)

		request.body.password = await hashPassword (newPassword)
		delete request.body.old_password
		delete request.body.new_password
	}

	const fields = Object.keys(request.body),
		data = Object.values(request.body)

	await db.query (
		`update marketplace.user_account
		${ genSqlCommands(fields, 2) }
		where user_id = $1`,
		[ userId, ...data ]
	)
	const updatedAccount = (await db.query(
		`select ${fields.join(', ')}
		from marketplace.user_account
		where user_id = $1`,
		[ userId ])).rows[0]
	response.status(StatusCodes.OK).json({
		updatedAccount
	})
}

const deleteUserAccount = async (request, response) => {
	const { userId } = request.user
	await db.query (
		`delete from marketplace.user_account
		where user_id = $1`,
		[ userId ])
	response.status(StatusCodes.OK).end()
}

const createCustomerAccount = async (request, response) => {
	const { userId } = request.user
	await db.query(
		`insert into marketplace.customer values ($1)`, 
		[ userId ])
	const newCustomerId = (await db.query(
		`select customer_id from marketplace.customer
		where customer_id = $1`,
	[ userId ])).rows[0].customer_id.toString()
	response.status(StatusCodes.CREATED).json({
		newCustomerId
	})
	/*
	if (!shippingInfo.delivery_contact) {
		if (phone) {
			shippingInfo.delivery_contact = phone
		} else {
			throw new BadRequestError(
				'Please provide a phone number contact'
			)
		}
	}
	await db.query(
		`insert into marketplace.shipping_info (
			customer_id,
			recepient_first_name,
			recepient_last_name,
			recepient_initials,
			street,
			postal_code,
			delivery_contact,
		) values ($1)`, 
		Object.values([
			...Object.values(shippingInfo) 
		])
	)
	*/
}

const getCustomerAccount = async (request, response) => {
	const { userId } = request.user
	const customerId = (await db.query (
		`select customer_id from marketplace.customer
		where customer_id=$1`,
		[ userId ] )).rows[0]
	response.status(StatusCodes.OK).json({
		customerId
	})
}

const updateCustomerAccount = async (request, response) => {}

const deleteCustomerAccount = async (request, response) => {}

const createVendorAccount = async (request, response) => {
	const { userId } = request.user
	await db.query(
		`insert into marketplace.vendor values ($1)`
		, [ userId ])
	const newVendorId = (await db.query(
		`select vendor_id from marketplace.vendor
		where vendor_id = $1`,
	[ userId ])).rows[0].vendor_id.toString()
	response.status(StatusCodes.CREATED).json ({
		newVendorId
	})
}

const getVendorAccount = async (request, response) => {}

const updateVendorAccount = async (request, response) => {}

const deleteVendorAccount = async (request, response) => {}

module.exports = {
	getUserAccount,
	updateUserAccount,
	deleteUserAccount,
	createVendorAccount,
	createCustomerAccount,
	getCustomerAccount,
}
