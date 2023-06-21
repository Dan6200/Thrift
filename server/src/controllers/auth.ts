import assert from 'node:assert/strict'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
// import validatePhoneNumber from 'security/validate-phone';
// import validateEmail from 'security/validate-email';
import { QueryResult } from 'pg'
import { UserDataSchemaRequest } from '../app-schema/users.js'
import db from '../db/index.js'
import { BadRequestError, UnauthenticatedError } from '../errors/index.js'
import { hashPassword, validatePassword } from '../security/password.js'
import { createToken } from '../security/create-token.js'
import { Insert } from './helpers/generate-sql-commands/index.js'
// TODO: IP address
// https://github.com/neekware/fullerstack/tree/main/libs/nax-ipware

const register = async (request: Request, response: Response) => {
	const schemaValidate = UserDataSchemaRequest.validate(request.body)
	if (schemaValidate.error)
		throw new BadRequestError(
			'Invalid User Data: ' + schemaValidate.error.message
		)
	const userData = schemaValidate.value,
		{ phone, email, password } = userData
	if (!phone && !email) {
		throw new BadRequestError(`please provide an email address or phone number`)
	}
	if (!password) {
		throw new BadRequestError(`please provide a password`)
	}
	if (email) {
		// TODO: const validEmail = validateEmail(email)
		const validEmail = true
		if (!validEmail)
			throw new BadRequestError(`
				please provide a valid email address
			`)
		// TODO: Email verification
	}
	if (phone) {
		// TODO: const validPhoneNumber = validatePhoneNumber(phone)
		const validPhoneNumber = true
		if (!validPhoneNumber)
			throw new BadRequestError(`
				please provide a valid phone number
			`)
		// TODO: SMS verification
	}
	userData.password = await hashPassword(password)
	let dbQuery: QueryResult = await db.query(
		`
    ${Insert('user_accounts', Object.keys(userData), 'user_id')}`,
		Object.values(userData)
	)
	const { rows } = dbQuery
	const userId: string = rows[0].user_id
	createToken(userId, token =>
		response
			.cookie('token', token, { httpOnly: true, maxAge: 30 * 60 * 60 })
			.status(StatusCodes.CREATED)
			.json({
				token,
			})
	)
	response.end()
}

const login = async (request: Request, response: Response) => {
	let email: string, phone: string, password: string
	email = phone = password = ''
	let token = request.cookies.token
	if (!token) {
		;({ email, phone, password } = request.body)
		if (!email && !phone) {
			throw new BadRequestError('Please provide email or phone number!')
		}
		if (!password) throw new BadRequestError('Please provide password')
		let user: any
		if (email) {
			user = (
				await db.query(
					`
			select user_id, password
			from user_accounts 
			where email=$1`,
					[email]
				)
			).rows[0]
		} else {
			user = (
				await db.query(
					`
			select user_id, password
			from user_accounts 
			where phone=$1`,
					[phone]
				)
			).rows[0]
		}
		if (!user) throw new UnauthenticatedError('Invalid Credentials')
		const pwdIsValid = await validatePassword(
			password,
			user.password.toString()
		)
		if (!pwdIsValid) throw new UnauthenticatedError('Invalid Credentials')
		// TODO: confirm user if there is a different IP Address
		// TODO: create separate IP Address tables as users may login
		// ...different IP Addresses
		token = createToken(user.user_id, token =>
			response
				.cookie('token', token, { httpOnly: true, maxAge: 30 * 60 * 60 })
				.status(StatusCodes.OK)
				.json({
					token,
				})
		)
	}
	response.end()
}

const logout = (_request: Request, response: Response) =>
	response.clearCookie('token').status(StatusCodes.OK).end()

export { register, login, logout }
