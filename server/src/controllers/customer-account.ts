import { Response } from 'express';
import { RequestWithPayload } from '../types-and-interfaces';
import db from '../db';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/';
import './helper-functions';
import { hashPassword, validatePassword } from '../security/password';
import path from 'path';
import { UserPayload } from '../types-and-interfaces';
const fileName = path.basename(__filename);

const createCustomerAccount = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { userId }: UserPayload = request.user;
	await db.query(`insert into customer values ($1)`, [userId]);
	response.status(StatusCodes.CREATED).send();
};

const getCustomerAccount = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { userId }: UserPayload = request.user;
	const customerData = (
		await db.query(
			`select * from customer
		where customer_id=$1`,
			[userId]
		)
	).rows[0];
	if (!customerData)
		throw new NotFoundError('Customer Account cannot be found');
	response.status(StatusCodes.OK).send();
};

const updateCustomerAccount = async (
	request: RequestWithPayload,
	response: Response
) => {};

const deleteCustomerAccount = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { userId }: UserPayload = request.user;
	await db.query(
		`delete from customer
			where customer_id=$1`,
		[userId]
	);
	response.status(StatusCodes.OK).send();
};

export {
	createCustomerAccount,
	getCustomerAccount,
	updateCustomerAccount,
	deleteCustomerAccount,
};
