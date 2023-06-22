import { Response } from 'express'
import assert from 'node:assert/strict'
import joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import { UserDataSchemaDB } from '../../app-schema/users.js'
import db from '../../db/index.js'
import { BadRequestError, UnauthenticatedError } from '../../errors/index.js'
import { hashPassword } from '../../security/password.js'
import {
	RequestWithPayload,
	RequestUserPayload,
} from '../../types-and-interfaces/request.js'
import { UserData } from '../../types-and-interfaces/user.js'
import validateUserPassword from '../helpers/validate-user-password.js'
import {
	Delete,
	Select,
	Update,
} from '../helpers/generate-sql-commands/index.js'

const userDataFields = [
	'first_name',
	'last_name',
	'email',
	'phone',
	'country',
	'dob',
]

let getUserAccount = async (
	request: RequestWithPayload,
	response: Response
) => {
	let { userId }: RequestUserPayload = request.user
	let dbResult = await db.query({
		text: Select('user_accounts', userDataFields, 'user_id=$1'),
		values: [userId],
	})
	if (dbResult.rows.length === 0)
		return response
			.status(StatusCodes.NOT_FOUND)
			.json({ msg: 'User cannot be found' })
	let userData = dbResult.rows[0]
	joi.assert(userData, UserDataSchemaDB)
	let userAccount: UserData = userData
	response.status(StatusCodes.OK).json(userAccount)
}

let updateUserAccount = async (
	request: RequestWithPayload,
	response: Response
) => {
	let { userId }: RequestUserPayload = request.user
	if (Object.keys(request.body).length === 0)
		throw new BadRequestError('request data cannot be empty')
	let fields: string[] = Object.keys(request.body),
		data: any[] = Object.values(request.body)
	const paramList = [...data, userId]
	let dbResult = await db.query({
		text: Update(
			'user_accounts',
			'user_id',
			fields,
			`user_id=$${paramList.length}`
		),
		values: paramList,
	})
	assert.equal(dbResult.rows.length, 1)
	const userAccount = dbResult.rows[0]
	response.status(StatusCodes.OK).json(userAccount)
}

let updateUserPassword = async (
	request: RequestWithPayload,
	response: Response
) => {
	let { userId }: RequestUserPayload = request.user
	if (Object.keys(request.body).length === 0)
		throw new BadRequestError('request data cannot be empty')
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
	const password: string = await hashPassword(newPassword)
	delete request.body.new_password
	request.body.password = password
	let fields: string[] = Object.keys(request.body),
		data: string[] = Object.values(request.body)
	const paramList = [...data, userId]
	await db.query({
		text: Update('user_accounts', 'user_id', fields, `user_id=$${paramList}`),
		values: paramList,
	})
	response.status(StatusCodes.NO_CONTENT).end()
}

let deleteUserAccount = async (
	request: RequestWithPayload,
	response: Response
) => {
	let { userId }: RequestUserPayload = request.user
	await db.query({
		text: Delete('user_accounts', 'user_id', 'user_id=$1'),
		values: [userId],
	})
	response.status(StatusCodes.NO_CONTENT).end()
}

export {
	getUserAccount,
	updateUserAccount,
	updateUserPassword,
	deleteUserAccount,
}
