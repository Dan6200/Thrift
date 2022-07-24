const db = require('../db')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const path = require('path')
const fileName = path.basename(__filename)
// Verify with a call and sms api...
const validatePhoneNumber = require('../security/validate-phone')
const validateEmail = require('../security/validate-email')
const { hashPassword, validatePassword } = require('../security/password')
const createToken = require('../security/create-token')
const locateIP = require('../security/ipgeolocator')

const register = async (request, response) => {
	const userData = request.body
	const {phoneNum, email, password} = userData
	if ((!phoneNum && !email)) {
		throw new BadRequestError(`please provide an email address or phone number`)
	}
	if (!email) {
		// TODO: const validPhoneNumber = validatePhoneNumber(phoneNum)
		const validPhoneNumber = true
		if (!validPhoneNumber)
			throw new BadRequestError(`please provide a valid phone number`)
	} else {
		// TODO: const validEmail = validateEmail(email)
		const validEmail = true
		if (!validEmail) {
			if (!validEmail)
				throw new BadRequestError(`
					please provide a valid email address
				`)
		}
	}
	if (!password) {
		throw new BadRequestError(`please provide a password`)
	}
	userData.password = hashPassword(password)
	await db.query(`
		insert into  ecommerce_app.user_account (
			first_name,
			last_name,
			initials,
			email,
			phone,
			password,
			ip_address,
			country,
			dob
		) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
		Object.values(userData)
	)
	const result = await db.query(`
		select user_id, first_name, initials 
		from ecommerce_app.user_account
	`)
	const newUser = result.rows[0]
	const token = createToken(newUser)
	response.status(StatusCodes.CREATED).json({
		msg: `success ${StatusCodes.CREATED}`,
		newUser,
		token
	})
}

const login = async (request, response) => {
	const {email, phone, password} = request.body
	if (!email && !phone) {
		throw new BadRequestError('Please provide email or phone number!')
	}
	if (!password) 
		throw new BadRequestError('Please provide password')
	let user
	if (!email) {
		user = (await db.query(`
			select user_id, first_name, initials
			from ecommerce_app.user_account, 
			where phone=$1`, phone)).rows[0]
	}
	if (!phone) {
		user = (await db.query(`
			select user_id, first_name, initials
			from ecommerce_app.user_account, 
			where email=$1`, email)).rows[0]
	}
	if (!user)
		throw new UnauthenticatedError('Invalid Credentials')
	const pwdIsValid = await validatePassword(password)
	if (!pwdIsValid)
		throw new UnauthenticatedError('Invalid Credentials')
	const token = user.createToken(user)
	const {user_id, first_name, initials} = user
	response.status(StatusCodes.OK).json({
		user: {
			id: user_id,
			name: first_name,
			initials,
		},
		token
	})
}

module.exports = {
	register,
	login
}
