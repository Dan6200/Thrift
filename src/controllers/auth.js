const db = require('../db')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const User = require('../models/user')
const path = require('path')
const fileName = path.basename(__filename)
// Verify with a call and sms api...
const validatePhoneNumber = require('../security/validate-phone')
const validateEmail = require('../security/validate-email')
const { hashPassword, loginValidatePassword } = require('../security/password')
const createJWT = require('../security/create-token')
const locateIP = require('../security/ipgeolocator')

const register = async (request, response) => {
//	const user = await User.create({...request.body})
//	const token = user.createJWT()
//	response.status(StatusCodes.CREATED).json({
//		user:{name: user.name},
//		token
//	})
	const userData = request.body
	const {phoneNum, email, password} = userData
	if ((!phoneNum && !email)) {
		throw new BadRequestError(`please provide an email address or phone number`)
	}
	if (!email) {
		const validPhoneNumber = validatePhoneNumber(phoneNum)
		if (!validPhoneNumber)
			throw new BadRequestError(`please provide a valid phone number`)
	} else {
		const validEmail = validateEmail(email)
		if (!validEmail) {
			if (!validEmail)
				throw new BadRequestError(`
					please provide a valid email address
				`)
		}
	}
	if (password) {
		throw new BadRequestError(`please provide a password`)
	}
	userData.hashedPassword = hashPassword(password)
	// For extra security test the password is null
	userData.password = null
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
		from user_account
	`)
	const newUser = result.rows[0]
	const token = createJWT(newUser)
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
	if (!email) {
		const user = await db.query(`
			select user_id, first_name, initials
			from user_account, 
			where email=$1`, email)
	}
	if (!user)
		throw new UnauthenticatedError('Invalid Credentials')
	const pwdIsValid = await user.validatePwd(password)
	if (!pwdIsValid)
		throw new UnauthenticatedError('Invalid Credentials')
	const token = user.createJWT()
	response.status(StatusCodes.OK).json({
		user:{name: user.name},
		token
	})
}

module.exports = {
	register,
	login
}
