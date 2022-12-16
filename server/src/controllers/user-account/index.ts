import { Response } from 'express';
import assert from 'node:assert/strict';
import joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import {
	RequestUserPayload,
	RequestWithPayload,
} from '../../types-and-interfaces/request';
import { UserDataSchemaDB } from '../../app-schema/users';
import db from '../../db';
import { BadRequestError, UnauthenticatedError } from '../../errors';
import { hashPassword } from '../../security/password';
import { UserData } from '../../types-and-interfaces/user';
import genSqlUpdateCommands from '../helpers/gen-sql-update-commands';
import validateUserPassword from '../helpers/validate-user-password';

const userDataFields = [
	'first_name',
	'last_name',
	'email',
	'phone',
	'ip_address',
	'country',
	'dob',
];

let getUserAccount = async (
	request: RequestWithPayload,
	response: Response
) => {
	let { userId }: RequestUserPayload = request.user;
	let dbResult = await db.query(
		`select 
			${userDataFields.join(', ')}
			from user_account 
			where user_id = $1`,
		[userId]
	);
	if (dbResult.rows.length === 0)
		return response
			.status(StatusCodes.NOT_FOUND)
			.send('User cannot be found');
	let userData = dbResult.rows[0];
	joi.assert(userData, UserDataSchemaDB);
	let userAccount: UserData = userData;
	response.status(StatusCodes.OK).json(userAccount);
};

let updateUserAccount = async (
	request: RequestWithPayload,
	response: Response
) => {
	let { userId }: RequestUserPayload = request.user;
	if (Object.keys(request.body).length === 0)
		throw new BadRequestError('request data cannot be empty');
	// TODO: validate and verify updated email and phone numbers
	let fields: string[] = Object.keys(request.body),
		data: any[] = Object.values(request.body);
	let dbResult = await db.query(
		// Generates A sql update command.
		// Takes the database name, the column name of the first item of the array
		// returns a list of columns from the database table
		`${genSqlUpdateCommands(
			'user_account',
			'user_id',
			fields
		)} returning ${userDataFields.join(', ')}`,
		[userId, ...data]
	);
	assert.equal(dbResult.rows.length, 1);
	const userAccount = dbResult.rows[0];
	response.status(StatusCodes.OK).json(userAccount);
};

let updateUserPassword = async (
	request: RequestWithPayload,
	response: Response
) => {
	let { userId }: RequestUserPayload = request.user;
	if (Object.keys(request.body).length === 0)
		throw new BadRequestError('request data cannot be empty');
	let {
		password: oldPassword,
		new_password: newPassword,
	}: {
		password: string;
		new_password: string;
	} = request.body;
	let pwdIsValid = await validateUserPassword(userId, oldPassword);
	if (!pwdIsValid)
		throw new UnauthenticatedError(`Invalid Credentials,
				cannot update password`);
	const password: string = await hashPassword(newPassword);
	delete request.body.new_password;
	request.body.password = password;
	let fields: string[] = Object.keys(request.body),
		data: any[] = Object.values(request.body);
	const result = await db.query(
		// Generates A sql update command.
		// Takes the database name, the column name of the first item of the array
		`${genSqlUpdateCommands('user_account', 'user_id', fields)}`,
		[userId, ...data]
	);
	response.status(StatusCodes.NO_CONTENT).json(result);
};

let deleteUserAccount = async (
	request: RequestWithPayload,
	response: Response
) => {
	let { userId }: RequestUserPayload = request.user;
	await db.query(
		`delete from user_account
		where user_id = $1`,
		[userId]
	);
	response.status(StatusCodes.OK).end();
};

export {
	getUserAccount,
	updateUserAccount,
	updateUserPassword,
	deleteUserAccount,
};
