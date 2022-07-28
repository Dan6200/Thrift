const db = require('../db')
const { StatusCodes } = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors/')

//	getAllAccounts,
//	getCustomerAccount,
//	getVendorAccount,
//	createCustomerAccount,
//	createVendorAccount,
//	updateCustomerAccount,
//	updateVendorAccount,
//	deleteAccount

const getAllAccounts = async (...[, response]) => {
	const vendorAccount = (await db.query('select * from ecommerce_app.vendor')).rows[0] || null
	const customerAccount = (await db.query('select * from ecommerce_app.customer')).rows[0] || null
	response.status(StatusCodes.OK).json({
		accounts: {
			customerAccount,
			vendorAccount,
		}
	})
}

const createCustomerAccount = async (request, response) => {
	const accountData = request.body
	await db.query(`
		insert into ecommerce_app.customer (
			customer_id,
			default_currency,
			preferred_currency
		) values ($1, $2, $3)
	`, Object.values(accountData))
	const result = await db.query('select * from ecommerce_app.customer')
	const newCustomer = result.rows[0] || null
	response.status(StatusCodes.CREATED).json({
		msg: `Customer account created ${StatusCode.CREATED}`,
		newCustomer 
	})
}

const createVendorAccount = async (request, response) => {
	const accountData = request.body
	await db.query(`
		insert into ecommerce_app.vendor (vendor_id)
		values ($1)
	`, Object.values(accountData))
	const result = await db.query('select * from ecommerce_app.vendor')
	const newVendor = result.rows[0]
	response.status(StatusCode.CREATED).json ({
		msg: `Vendor account created ${StatusCode.CREATED}`,
		newVendor 
	})
}

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
	getAllAccounts,
	createVendorAccount,
	createCustomerAccount,
	getJob,
	updateJob,
	deleteJob
}

