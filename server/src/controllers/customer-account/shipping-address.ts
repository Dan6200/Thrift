import { Response } from 'express';
import { RequestWithPayload } from '../../types-and-interfaces';
import db from '../../db';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../../errors/';
import './helper-functions';
import { UserPayload } from '../../types-and-interfaces';

// Convert customerAccountRouter to shippingInfoRouter
const createShippingInfo = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { userId }: UserPayload = request.user;
	const shippingInfo = request.body;
	let shippingDataLength = Object.values(shippingInfo).length;
	if (shippingDataLength === 0)
		throw new BadRequestError('Request Body cannot be empty');

	await db.query(
		// address_id				serial			primary key,
		// customer_id				int				not null		references	user_account	on	delete	cascade,
		// recepient_first_name	varchar(30)		not null,
		// recepient_last_name		varchar(30)		not null,
		// recepient_initials		char(2)			not nll,
		// street					varchar			not null,
		// postal_code				varchar			not null,
		// delivery_contact		varchar			not	null,
		// delivery_instructions	varchar,
		// is_default				boolean			not null
		`insert into shipping_info(
		) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
		[userId, ...Object.values(shippingInfo)]
	);
	response.status(StatusCodes.CREATED).send();
};

const getShippingInfo = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { userId }: UserPayload = request.user;
	const shippingInfo = (
		await db.query(`select * from shipping_info where customer_id=$1`, [
			userId,
		])
	).rows[0];
	if (!shippingInfo)
		throw new NotFoundError('Shipping Information cannot be found');
	response.status(StatusCodes.OK).send(shippingInfo);
};

const updateShippingInfo = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { userId }: UserPayload = request.user;
	const shippingInfo = request.body;
};

const deleteShippingInfo = async (
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
	createShippingInfo,
	getShippingInfo,
	updateShippingInfo,
	deleteShippingInfo,
};
