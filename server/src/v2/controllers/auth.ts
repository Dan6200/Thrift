import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { QueryResult } from 'pg'
import db from '../db/pg/index.js'
import { BadRequestError, UnauthenticatedError } from '../errors/index.js'
import { hashPassword, validatePassword } from '../security/password.js'
import { createToken } from '../security/create-token.js'
import {
	InsertInTable,
	SelectFromTable,
} from './helpers/generate-sql-commands/index.js'
import { revokeToken } from './helpers/revoke-token.js'
import { AccountData } from '../types-and-interfaces/account.js'
import { validateAccountData } from './helpers/validateAccountData.js'
// TODO: IP address

/**
 * @param {Request} request
 * @param {Response} response
 * @returns {Promise<void>}
 * @description Create a new user account
 * @todo: Validate email and phone number through Email and SMS
 */
const register = async (
	request: Request,
	response: Response
): Promise<void> => {
	const userData: AccountData = await validateAccountData(
		request.body as AccountData
	)
	const { password } = userData
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
