import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { QueryResult } from 'pg'
import { UserDataSchemaRequest } from '../app-schema/users.js'
import db from '../db/pg/index.js'
import { BadRequestError, UnauthenticatedError } from '../errors/index.js'
import { hashPassword, validatePassword } from '../security/password.js'
import { createToken } from '../security/create-token.js'
import {
	InsertInTable,
	SelectFromTable,
} from './helpers/generate-sql-commands/index.js'
import { UserData } from '../types-and-interfaces/user.js'
import { revokeToken } from './helpers/revoke-token.js'
// TODO: IP address

const register = async (request: Request, response: Response) => {
	const schemaValidate = UserDataSchemaRequest.validate(request.body)
	if (schemaValidate.error)
		throw new BadRequestError(
			'Invalid User Data: ' + schemaValidate.error.message
		)
	const userData: UserData = schemaValidate.value,
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
	userData.password = await hashPassword(<string>password)
	let dbQuery: QueryResult = await db.query({
		text: InsertInTable('user_accounts', Object.keys(userData), 'user_id'),
		values: Object.values(userData),
	})
	const { rows } = dbQuery
	const userId: string = rows[0].user_id
	const token = createToken(userId)
	response.status(StatusCodes.CREATED).json({
		token,
	})
}

const login = async (request: Request, response: Response) => {
	let { email, phone, password }: { [index: string]: string } = request.body
	if (!email && !phone) {
		throw new BadRequestError('Please provide email or phone number!')
	}
	if (!password) throw new BadRequestError('Please provide password')
	let user: any
	if (email) {
		user = (
			await db.query({
				text: SelectFromTable(
					'user_accounts',
					['user_id', 'password'],
					'email=$1'
				),
				values: [email],
			})
		).rows[0]
	} else {
		user = (
			await db.query({
				text: SelectFromTable(
					'user_accounts',
					['user_id', 'password'],
					'phone=$1'
				),
				values: [phone],
			})
		).rows[0]
	}
	if (!user) throw new UnauthenticatedError('Invalid Credentials')
	const pwdIsValid = await validatePassword(password, user.password.toString())
	if (!pwdIsValid) throw new UnauthenticatedError('Invalid Credentials')
	const token = createToken(user.user_id)
	response.status(StatusCodes.OK).json({
		token,
	})
}

const logout = (request: Request, response: Response) => {
	const authHeader = request.headers.authorization
	if (!authHeader || !authHeader?.startsWith('Bearer '))
		throw new UnauthenticatedError('Unauthorized Operation')
	const token = authHeader.split(' ')[1]
	revokeToken(token)
	response.status(StatusCodes.OK).end()
}

export { register, login, logout }
