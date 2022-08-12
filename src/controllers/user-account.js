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
	response.status(StatusCodes.OK).end()
}

const deleteUserAccount = async (request, response) => {
	const { userId } = request.user
	await db.query (
		`delete from marketplace.user_account
		where user_id = $1`,
		[ userId ])
	response.status(StatusCodes.OK).end()
}

module.exports = {
	getUserAccount,
	updateUserAccount,
	deleteUserAccount
}
