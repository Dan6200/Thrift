import { Response } from 'express';
import {
	RequestWithPayload,
	RequestUserPayload,
} from 'types-and-interfaces/request';
import db from 'db';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError, ServerError } from 'errors/';
import {
	genSqlUpdateCommands,
	validateUserPassword,
} from 'controllers/helper-functions';
import { UserData } from 'types-and-interfaces/user';
import { UserDataSchemaDB } from 'app-schema/users';
import { hashPassword } from 'security/password';

let getUserAccount = async (
	request: RequestWithPayload,
	response: Response
) => {
	let { userId }: RequestUserPayload = request.user;
	let dbResult = await db.query(
		`select 
				first_name,
				last_name,
				email,
				phone,
				password,
				ip_address,
				country,
				dob,
				is_vendor,
				is_customer
			from user_account 
			where user_id = $1`,
		[userId]
	);
	if (dbResult.rows.length === 0)
		return response
			.status(StatusCodes.NOT_FOUND)
			.send('User cannot be found');
	const validateSchema = UserDataSchemaDB.validate(dbResult.rows[0]);
	if (validateSchema.error) {
		throw new ServerError(
			'Invalid Data Schema: ' + validateSchema.error.message
		);
	}
	let userAccount: UserData = validateSchema.value;
	response.status(StatusCodes.OK).json(userAccount);
};

let updateUserAccount = async (
	request: RequestWithPayload,
	response: Response
) => {
	let { userId }: RequestUserPayload = request.user;
	// console.log(request.body, __filename);
	if (Object.keys(request.body).length === 0)
		throw new BadRequestError('request data cannot be empty');
	// TODO: validate and verify updated email and phone numbers
	let {
		old_password: oldPassword,
		new_password: newPassword,
	}: {
		old_password?: string;
		new_password?: string;
	} = request.body;
	if (oldPassword) {
		delete request.body.old_password;
		delete request.body.new_password;
		let pwdIsValid = validateUserPassword(userId, oldPassword);
		if (!pwdIsValid)
			throw new UnauthenticatedError(`Invalid Credentials,
				cannot update password`);
		const password: string = await hashPassword(newPassword as string);
		request.body.password = password;
	}
	let fields: string[] = Object.keys(request.body),
		data: any[] = Object.values(request.body),
		offset: number = 2;
	await db.query(
		// Generates A sql update command.
		// Takes the database name, the column name of the first item of the array
		`${genSqlUpdateCommands('user_account', 'user_id', fields, offset)}`,
		[userId, ...data]
	);
	let dbResult = await db.query(
		`select 
				first_name,
				last_name,
				email,
				phone,
				password,
				ip_address,
				country,
				dob,
				is_vendor,
				is_customer
			from user_account 
			where user_id = $1`,
		[userId]
	);
	if (dbResult.rows.length === 0)
		throw new ServerError('Update unsuccessful');
	const validateSchema = UserDataSchemaDB.validate(dbResult.rows[0]);
	if (validateSchema.error) {
		throw new ServerError(
			'Invalid Data Schema: ' + validateSchema.error.message
		);
	}
	let userAccount: UserData = validateSchema.value;
	response.status(StatusCodes.OK).json(userAccount);
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

export { getUserAccount, updateUserAccount, deleteUserAccount };
