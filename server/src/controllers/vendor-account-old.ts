import { Response } from 'express';
import { RequestWithPayload } from 'types-and-interfaces/request';
import db from 'db';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from 'errors/';

const createVendorAccount = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { userId } = request.user;
	await db.query(`insert into vendor values ($1)`, [userId]);
	response.status(StatusCodes.CREATED).send();
};

const getVendorAccount = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { userId } = request.user;
	const res = (
		await db.query(
			`select vendor_id from vendor
		where vendor_id=$1`,
			[userId]
		)
	).rows[0];
	if (!res)
		return response
			.status(StatusCodes.NOT_FOUND)
			.send({ msg: 'User does not have a vendor account' });
	response.status(StatusCodes.OK).send();
};

const updateVendorAccount = async (
	_request: RequestWithPayload,
	_response: Response
) => {};

const deleteVendorAccount = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { userId } = request.user;
	await db.query(
		`delete from vendor
		where vendor_id=$1`,
		[userId]
	);
	response.status(StatusCodes.OK).send();
};

export {
	createVendorAccount,
	getVendorAccount,
	updateVendorAccount,
	deleteVendorAccount,
};
