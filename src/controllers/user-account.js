const db = require('../db')
const { StatusCodes } = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors/')
const { genUpdateCommands } = require('./helper-functions')

//	getUserAccount,
//	getCustomerAccount,
//	getVendorAccount,
//	createCustomerAccount,
//	createVendorAccount,
//	updateCustomerAccount,
//	updateVendorAccount,
//	deleteUserAccount,
//	deleteCustomerAccount
//	deleteVendorAccount

const getUserAccount = async (request, response) => {
	const { userId } = request.user
	const userAccount = (await db.query(
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
	response.status(StatusCodes.OK).json({
		userAccount 
	})
}

const updateUserAccount = async (request, response) => {
	const { userId } = request.user
	const updatedData = request.body
	if (!Object.keys(updatedData).length)
		throw new BadRequestError ('request data cannot be empty')
	await db.query (
		`update user_account
		${ genUpdateCommands(Object.keys(updatedData), 2) }
		where user_id = $1`,
		[ userId, ...Object.values(updatedData) ]
	)
	response.status(StatusCodes.OK)
}

const deleteUserAccount = async (request, response) => {
	const { userId } = request.user
	await db.query (
		`delete from user_account
		where user_id = $1`,
		[ userId ])
	response.status(StatusCodes.OK)
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
