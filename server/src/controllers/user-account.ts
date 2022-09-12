import { Response } from 'express';
import { RequestWithPayload } from 'types-and-interfaces';
import db from 'db';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError, UnauthenticatedError } from 'errors/';
import {
	genSqlUpdateCommands,
	validateUserPassword,
} from 'controllers/helper-functions';
import { hashPassword, validatePassword } from 'security/password';
import { UserData, UserPayload } from 'types-and-interfaces';

let getUserAccount = async (
	request: RequestWithPayload,
	response: Response
) => {
	let { userId }: UserPayload = request.user;
	let userAccount: UserData = (
		await db.query(
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
		)
	).rows[0];
	if (!userAccount) throw new NotFoundError('User cannot be found');
	response.status(StatusCodes.OK).json({
		userAccount,
	});
};

let updateUserAccount = async (
	request: RequestWithPayload,
	response: Response
) => {
	let { userId }: UserPayload = request.user;
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
		let pwdIsValid = validateUserPassword(userId, oldPassword);

		if (!pwdIsValid)
			throw new UnauthenticatedError(`Invalid Credentials,
				cannot update password`);

		request.body.password = await hashPassword(newPassword);

		delete request.body.old_password;
		delete request.body.new_password;
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
	response.status(StatusCodes.OK).end();
};

let deleteUserAccount = async (
	request: RequestWithPayload,
	response: Response
) => {
	let { userId }: UserPayload = request.user;
	await db.query(
		`delete from user_account
		where user_id = $1`,
		[userId]
	);
	response.status(StatusCodes.OK).end();
};

export { getUserAccount, updateUserAccount, deleteUserAccount };
