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
	const {phone, email, password} = userData
	if (!phone && !email) {
		throw new BadRequestError(`please provide an email address or phone number`)
	}
	if (!password) {
		throw new BadRequestError(`please provide a password`)
	}
	let contact
	if (!email) {
		// TODO: const validPhoneNumber = validatePhoneNumber(phone)
		const validPhoneNumber = true
		if (!validPhoneNumber)
			throw new BadRequestError(`
				please provide a valid phone number
			`)
		// TODO: SMS verification
		contact = 'phone'
	} else {
		// TODO: const validEmail = validateEmail(email)
		const validEmail = true
		if (!validEmail)
			throw new BadRequestError(`
				please provide a valid email address
			`)
		// TODO: Email verification
		contact = 'email'
	}
	userData.password = await hashPassword(password)
	await db.query(`
		insert into  marketplace.user_account (
			first_name,
			last_name,
			initials,
			${contact},
			password,
			ip_address,
			country,
			dob,
			is_vendor,
			is_customer
		) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
		Object.values(userData)
	)
	const result = await db.query(`
		select user_id, phone, email from marketplace.user_account
	`)
	const lastInsert = result.rowCount-1
	const newUser = result.rows[lastInsert]
	const token = createToken(newUser)
	const { user_id: newUserId } = newUser
	response.status(StatusCodes.CREATED).json({
		newUserId,
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
	let user, result
	if (!email) {
		result = await db.query(`
			select user_id, password
			from marketplace.user_account 
			where phone=$1`, [phone]) 
	}
	if (!phone) {
		result = await db.query(`
			select user_id, password
			from marketplace.user_account 
			where email=$1`, [email])
	}
	const lastInsert = result.rowCount-1
	user = result.rows[lastInsert]
	if (!user)
		throw new UnauthenticatedError('Invalid Credentials')
	const pwdIsValid = await validatePassword(password, user.password.toString())
	if (!pwdIsValid)
		throw new UnauthenticatedError('Invalid Credentials')

	// TODO: confirm user if there is a different IP Address
	
	const token = createToken(user)
	const {user_id: userId} = user
	response.status(StatusCodes.OK).json({
		userId,
		token
	})
}

module.exports = {
	register,
	login
}
