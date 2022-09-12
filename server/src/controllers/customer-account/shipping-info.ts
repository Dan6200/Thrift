import { Response } from 'express';
import { RequestWithPayload } from 'types-and-interfaces';
import db from 'db';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from 'errors/';
import { UserPayload } from 'types-and-interfaces';
import { genSqlUpdateCommands } from 'controllers/helper-functions';

const createShippingInfo = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { userId }: UserPayload = request.user;
	let customerId = userId;
	const shippingData = request.body;
	let shippingDataLength = Object.values(shippingData).length;
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
			customer_id,
			recepient_first_name,
			recepient_last_name,
			street,
			postal_code,
			delivery_contact,
			delivery_instructions,
			is_default
		) values ($1, $2, $3, $4, $5, $6, $7, $8)`,
		[customerId, ...Object.values(shippingData)]
	);
	let addressId = (await db.query('select address_id from shipping_info'))
		.rows[0];
	console.log('addressId: %O', addressId);
	console.log('from: ' + __filename);
	response.status(StatusCodes.CREATED).send({
		addressId,
	});
};

const getShippingInfo = async (
	request: RequestWithPayload,
	response: Response
) => {
	const addressId = request.params;
	const shippingInfo = (
		await db.query(`select * from shipping_info where address_id=$1`, [
			addressId,
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
	const addressId = request.params,
		shippingData = request.body;
	let fields = Object.keys(shippingData),
		data = Object.values(shippingData),
		offset = 2;
	await db.query(
		`${genSqlUpdateCommands(
			'shipping_info',
			'address_id',
			fields,
			offset
		)}`,
		[addressId, ...data]
	);
	response.status(StatusCodes.OK).send();
};

const deleteShippingInfo = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { userId }: UserPayload = request.user;
	await db.query(
		`delete from shipping_info
			where address_id=$1`,
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
