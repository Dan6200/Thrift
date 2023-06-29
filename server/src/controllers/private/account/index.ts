import { Response } from 'express'
import joi from 'joi'
import db from '../../../db/pg/index.js'
import { StatusCodes } from 'http-status-codes'
import BadRequestError from '../../../errors/bad-request.js'
import UnauthenticatedError from '../../../errors/unauthenticated.js'
import { hashPassword } from '../../../security/password.js'
import {
	RequestWithPayload,
	RequestUserPayload,
} from '../../../types-and-interfaces/request.js'
import {
	UpdateInTable,
	DeleteInTable,
} from '../../helpers/generate-sql-commands/index.js'
import validateUserPassword from '../../helpers/validate-user-password.js'
import { AccountDataSchemaDB } from '../../../app-schema/account.js'
import { AccountData } from '../../../types-and-interfaces/account.js'

const accountDataFields = [
	'first_name',
	'last_name',
	'email',
	'phone',
	'country',
	'dob',
]

const getUserInfoQuery = `
SELECT ${accountDataFields.map(field => `ua.${field}`).join(', ')},
       CASE WHEN c.customer_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_customer,
       CASE WHEN v.vendor_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_vendor
FROM user_accounts ua
LEFT JOIN customers c
ON ua.user_id = c.customer_id
LEFT JOIN vendors v
ON ua.user_id = v.vendor_id
WHERE ua.user_id = $1`

let getUserAccount = async (
	request: RequestWithPayload,
	response: Response
) => {
	let { userId }: RequestUserPayload = request.user
	console.log(getUserInfoQuery)
	let dbResult = await db.query({
		text: getUserInfoQuery,
		values: [userId],
	})
	if (dbResult.rows.length === 0)
		return response
			.status(StatusCodes.NOT_FOUND)
			.json({ msg: 'User cannot be found' })
	let accountData = dbResult.rows[0]
	joi.assert(accountData, AccountDataSchemaDB)
	let account: AccountData = accountData
	response.status(StatusCodes.OK).json(account)
}

let updateUserAccount = async (
	request: RequestWithPayload,
	response: Response
) => {
	let { userId }: RequestUserPayload = request.user
	if (Object.keys(request.body).length === 0)
		throw new BadRequestError('request data cannot be empty')
	if (Object.hasOwn(request.body, 'password'))
		throw new BadRequestError('Cannot update password here')
	let fields: string[] = Object.keys(request.body),
		data: any[] = Object.values(request.body)
	const paramList = [...data, userId]
	const pos: number = paramList.length
	let dbResult = await db.query({
		text: UpdateInTable('user_accounts', 'user_id', fields, `user_id=$${pos}`),
		values: paramList,
	})
	if (!dbResult.rows.length) throw new BadRequestError('Update unsuccessful')
	response.status(StatusCodes.NO_CONTENT).end()
}

let updateUserPassword = async (
	request: RequestWithPayload,
	response: Response
) => {
	let { userId }: RequestUserPayload = request.user
	if (Object.keys(request.body).length === 0)
		throw new BadRequestError('request data cannot be empty')
	// check if password exists in request body
	// throw a bad request error if it does not
	if (!Object.hasOwn(request.body, 'password'))
		throw new BadRequestError('Provide current password')
	let {
		password: oldPassword,
		new_password: newPassword,
	}: {
		password: string
		new_password: string
	} = request.body
	let pwdIsValid = await validateUserPassword(userId, oldPassword)
	if (!pwdIsValid)
		throw new UnauthenticatedError(`Invalid Credentials,
				cannot update password`)
	const password = await hashPassword(newPassword)
	const paramList = [password, userId]
	const position: number = paramList.length
	const dbResult = await db.query({
		text: UpdateInTable(
			'user_accounts',
			'user_id',
			['password'],
			`user_id=$${position}`
		),
		values: paramList,
	})
	if (!dbResult.rows.length)
		throw new BadRequestError('Password update unsuccessful')
	response.status(StatusCodes.NO_CONTENT).end()
}

let deleteUserAccount = async (
	request: RequestWithPayload,
	response: Response
) => {
	let { userId }: RequestUserPayload = request.user
	const dbResult = await db.query({
		text: DeleteInTable('user_accounts', 'user_id', 'user_id=$1'),
		values: [userId],
	})
	if (!dbResult.rows.length) throw new BadRequestError('Delete unsuccessful')
	response.status(StatusCodes.NO_CONTENT).end()
}

export {
	getUserAccount,
	updateUserAccount,
	updateUserPassword,
	deleteUserAccount,
}
