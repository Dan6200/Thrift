import assert from 'node:assert/strict';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
// import validatePhoneNumber from 'security/validate-phone';
// import validateEmail from 'security/validate-email';
import { QueryResult } from 'pg';
import path from 'path';
import { UserDataSchemaRequest } from '../app-schema/users';
import db from '../db';
import { BadRequestError, UnauthenticatedError } from '../errors';
import { hashPassword, validatePassword } from '../security/password';
import { createToken } from '../security/create-token';
const filename = path.basename(__filename);
// TODO: IP address
// https://github.com/neekware/fullerstack/tree/main/libs/nax-ipware

const register = async (request: Request, response: Response) => {
	const schemaValidate = UserDataSchemaRequest.validate(request.body);
	if (schemaValidate.error)
		throw new BadRequestError(
			'Invalid User Data: ' + schemaValidate.error.message
		);
	const userData = schemaValidate.value,
		{ phone, email, password } = userData;
	if (!phone && !email) {
		throw new BadRequestError(
			`please provide an email address or phone number`
		);
	}
	if (!password) {
		throw new BadRequestError(`please provide a password`);
	}
	if (email) {
		// TODO: const validEmail = validateEmail(email)
		const validEmail = true;
		if (!validEmail)
			throw new BadRequestError(`
				please provide a valid email address
			`);
		// TODO: Email verification
	}
	if (phone) {
		// TODO: const validPhoneNumber = validatePhoneNumber(phone)
		const validPhoneNumber = true;
		if (!validPhoneNumber)
			throw new BadRequestError(`
				please provide a valid phone number
			`);
		// TODO: SMS verification
	}
	userData.password = await hashPassword(password);
	let dbQuery: QueryResult = await db.query(
		`
		insert into user_account (
			first_name,
			last_name,
			email,
			phone,
			password,
			dob,
			country,
			ip_address
		) values ($1, $2, $3, $4, $5, $6, $7, $8) returning user_id`,
		Object.values(userData)
	);
	let { rowCount }: { rowCount: number } = dbQuery;
	let lastInsert = rowCount ? rowCount - 1 : rowCount;
	assert.ok(lastInsert >= 0 && lastInsert < rowCount);
	const userId: string = dbQuery.rows[lastInsert].user_id,
		token: string = createToken(userId);
	response.status(StatusCodes.CREATED).json({
		token,
	});
};

const login = async (request: Request, response: Response) => {
	const { email, phone, password } = request.body;
	if (!email && !phone) {
		throw new BadRequestError('Please provide email or phone number!');
	}
	if (!password) throw new BadRequestError('Please provide password');
	let user: any;
	if (email) {
		user = (
			await db.query(
				`
			select user_id, password
			from user_account 
			where email=$1`,
				[email]
			)
		).rows[0];
	} else {
		user = (
			await db.query(
				`
			select user_id, password
			from user_account 
			where phone=$1`,
				[phone]
			)
		).rows[0];
	}
	if (!user) throw new UnauthenticatedError('Invalid Credentials');
	const pwdIsValid = await validatePassword(
		password,
		user.password.toString()
	);
	if (!pwdIsValid) throw new UnauthenticatedError('Invalid Credentials');
	// TODO: confirm user if there is a different IP Address
	// TODO: create separate IP Address tables as users may login
	// ...different IP Addresses
	const token = createToken(user.user_id);
	response.status(StatusCodes.CREATED).json({
		token,
	});
};

export { register, login };
