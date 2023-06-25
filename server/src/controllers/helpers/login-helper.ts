import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import db from '../../db/index.js'
import BadRequestError from '../../errors/bad-request.js'
import UnauthenticatedError from '../../errors/unauthenticated.js'
import { createToken } from '../../security/create-token.js'
import { validatePassword } from '../../security/password.js'
import { SelectFromTable } from './generate-sql-commands/index.js'

export async function loginWithCredentials(
	request: Request,
	response: Response
) {
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
	response
		.cookie('token', token, { httpOnly: true, maxAge: 30 * 60 * 60 })
		.status(StatusCodes.OK)
		.json({
			token,
		})
}
