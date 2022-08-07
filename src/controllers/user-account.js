const db = require('../db')
const { StatusCodes } = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors/')

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
			user_id, 
			first_name,
			last_name,
			email,
			phone,
			ip_address,
			country,
			dob,
			customer_id,
			vendor_id
		from marketplace.user_account 
		left outer join marketplace.vendor on (user_id = vendor_id) 
		left outer join marketplace.customer on (vendor_id = customer_id)
		where user_id = $1` 
	, [ userId ])).rows[0]
	response.status(StatusCodes.OK).json({
		userAccount: {
			userId: userAccount.user_id.toString(),
			vendorId: userAccount.vendor_id.toString(),
			customerId: userAccount.customer_id.toString(),
			...userAccount
		}
	})
}

const updateUserAccount = async (request, response) => {
}

const deleteUserAccount = async (request, response) => {}

const createCustomerAccount = async (request, response) => {
	const { userId } = request.user
	await db.query(
		`insert into marketplace.customer values ($1)`, 
		[ userId ]
	)
	const result = await db.query(
		`select customer_id from marketplace.customer`
	)
	const lastInsert = result.rowCount-1
	const newCustomerId = result.rows[ lastInsert ].customer_id.toString()
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

const getCustomerAccount = async (request, response) => {}

const updateCustomerAccount = async (request, response) => {}

const deleteCustomerAccount = async (request, response) => {}

const createVendorAccount = async (request, response) => {
	const { userId } = request.user
	await db.query(
		`insert into marketplace.vendor values ($1)`
		, [ userId ])
	const result = await db.query(
		`select vendor_id from marketplace.vendor`
	)
	const lastInsert = result.rowCount-1
	const newVendorId = result.rows[ lastInsert ].vendor_id.toString()
	response.status(StatusCodes.CREATED).json ({
		newVendorId
	})
}

const getVendorAccount = async (request, response) => {}

const updateVendorAccount = async (request, response) => {}

const deleteVendorAccount = async (request, response) => {}

const getJob = async (req, res) => {
	const {
		user:{userId},
		params: {
			id: jobId
		}
	} = req
	const job = await Job.findOne({
		_id: jobId,
		createdBy: userId
	})
	if (!job)
		throw new NotFoundError(`No job with id ${jobId}`)
	res.status(StatusCode.OK).json({ job })
}

const updateJob = async (req, res) => {
	const {
		body: { company, position },
		user:{ userId },
		params: {
			id: jobId
		}
	} = req
	if (company===''||position==='') {
		throw new BadRequestError(`Company and Position fields cannot be empty`)
	}
	const job = await Job.findOneAndUpdate({
		_id: jobId,
		createdBy: userId
	}, 
	req.body,{
		new: true,
		runValidators: true
	})
	if (!job)
		throw new NotFoundError(`No job with id ${jobId}`)
	res.status(StatusCode.OK).json({ job })
}

const deleteJob = async (req, res) => {
	const {
		body: { company, position },
		user:{ userId },
		params: {
			id: jobId
		}
	} = req
	const job = await Job.findOneAndDelete({
		_id: jobId,
		createdBy: userId
	})
	if (!job)
		throw new NotFoundError(`No job with id ${jobId}`)
	res.status(StatusCode.OK).json({ job })
}

module.exports = {
	getUserAccount,
	createVendorAccount,
	createCustomerAccount,
	getJob,
	updateJob,
	deleteJob
}

