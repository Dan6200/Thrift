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
	const userId = request.user
	const userAccount = (await db.query(
		`select * from ecommerce_app.user_account where user_id = ${userId}
		left outer join ecommerce_app.vendor on (user_id = vendor_id) 
		join ecommerce_app.vendor on (user_id = vendor_id)`
	)).rows[0]
	response.status(StatusCodes.OK).json({
		userAccount
	})
}

const updateUserAccount = async (request, response) => {}

const deleteUserAccount = async (request, response) => {}

const createCustomerAccount = async (request, response) => {
	const userAccount = request.user
	const accountData = request.body
	await db.query(`
		insert into ecommerce_app.customer (
			customer_id,
			currency
		) values ($1, $2)
	`, Object.values(accountData))
	const result = await db.query('select * from ecommerce_app.customer')
	const lastInsert = result.rowCount-1
	const newCustomerAccount = result.rows[lastInsert]
	response.status(StatusCodes.CREATED).json({
		userAccount,
		newCustomerAccount
	})
}

const getCustomerAccount = async (request, response) => {}

const updateCustomerAccount = async (request, response) => {}

const deleteCustomerAccount = async (request, response) => {}

const createVendorAccount = async (request, response) => {
	const userAccount = request.user
	const accountData = request.body
	await db.query(
		`insert into ecommerce_app.vendor values ($1)`
		, Object.values(accountData))
	const result = await db.query(
		`select * from ecommerce_app.vendor
		where `
	)
	const lastInsert = result.rowCount-1
	const newVendorAccount = result.rows[lastInsert]
	response.status(StatusCodes.CREATED).json ({
		userAccount,
		newVendorAccount
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

