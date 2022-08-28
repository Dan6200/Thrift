import db from '../db';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/';

const createVendorAccount = async (request, response) => {
	const { userId } = request.user;
	await db.query(`insert into marketplace.vendor values ($1)`, [userId]);
	response.status(StatusCodes.CREATED).send();
};

const getVendorAccount = async (request, response) => {
	const { userId } = request.user;
	const res = (
		await db.query(
			`select vendor_id from marketplace.vendor
		where vendor_id=$1`,
			[userId]
		)
	).rows[0];
	if (!res) throw new NotFoundError('Vendor account cannot be found');
	response.status(StatusCodes.OK).send();
};

const updateVendorAccount = async (request, response) => {};

const deleteVendorAccount = async (request, response) => {
	const { userId } = request.user;
	await db.query(
		`delete from marketplace.vendor
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
