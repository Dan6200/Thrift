import { Response } from 'express';
import { RequestWithPayload } from 'types-and-interfaces';
import db from 'db';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from 'errors/';
import { UserPayload } from 'types-and-interfaces';
import { genSqlUpdateCommands } from 'controllers/helper-functions';

const createShippingInfo = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { userId }: UserPayload = request.user;
	let customerId = userId;
	// limit amount of shippingInfo to 5...
	const LIMIT = 5;
	let overLimit: boolean =
		LIMIT <=
		(await db.query('select count(address_id) from shipping_info')).rows[0]
			.count;
	if (overLimit)
		throw new BadRequestError(
			`Each customer is limited to only ${LIMIT} shipping addresses`
		);
	const shippingData = request.body;
	let shippingDataLength = Object.values(shippingData).length;
	if (shippingDataLength === 0)
		throw new BadRequestError('Request Body cannot be empty');

	await db.query(
		`insert into shipping_info(
			customer_id,
			recepient_first_name,
			recepient_last_name,
			street,
			postal_code,
			delivery_contact,
			delivery_instructions,
			is_primary
		) values ($1, $2, $3, $4, $5, $6, $7, $8)`,
		[customerId, ...Object.values(shippingData)]
	);
	let addressId = (await db.query('select address_id from shipping_info'))
		.rows[0].address_id;
	response.status(StatusCodes.CREATED).send({
		addressId,
	});
};

const getAllShippingInfo = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { userId: customerId } = request.user;
	const shippingInfos = (
		await db.query(`select * from shipping_info where customer_id=$1`, [
			customerId,
		])
	).rows;
	if (!shippingInfos)
		return response
			.status(StatusCodes.NOT_FOUND)
			.send('User has no shipping information available');
	response.status(StatusCodes.OK).send({ shippingInfos });
};

const getShippingInfo = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { addressId } = request.params;
	const shippingInfo = (
		await db.query(`select * from shipping_info where address_id=$1`, [
			addressId,
		])
	).rows[0];
	if (!shippingInfo)
		return response
			.status(StatusCodes.NOT_FOUND)
			.send('Shipping Information cannot be found');
	response.status(StatusCodes.OK).send({ shippingInfo });
};

const updateShippingInfo = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { addressId } = request.params,
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
	const { addressId } = request.params;
	await db.query(
		`delete from shipping_info
			where address_id=$1`,
		[addressId]
	);
	response.status(StatusCodes.OK).send();
};

export {
	createShippingInfo,
	getShippingInfo,
	getAllShippingInfo,
	updateShippingInfo,
	deleteShippingInfo,
};
