import processRoute from 'controllers/helpers/process-route';
import db from 'db';
import { ResponseData, Status } from 'types-and-interfaces/routes-processor';
import { StatusCodes } from 'http-status-codes';
const { CREATED, OK, NO_CONTENT } = StatusCodes;

const createQuery = [
		({ userId }) => db.query(`insert into customer values($1)`, [userId]),
	],
	readQuery = [
		({ userId }) =>
			db.query(`select * from customer where customer_id=$1`, [userId]),
	],
	deleteQuery = [() => db.query(`delete from customer`)],
	validateResult = (result: any, status: Status): ResponseData => {
		if (result.rowCount === 0)
			return {
				status: 404,
				data: 'Route does not exit',
			};
		return {
			status,
			data: result.rows[result.rowCount - 1],
		};
	};

let createCustomerAccount = processRoute(createQuery, { status: CREATED }),
	getCustomerAccount = processRoute(
		readQuery,
		{ status: OK },
		undefined,
		validateResult
	),
	deleteCustomerAccount = processRoute(
		deleteQuery,
		{ status: NO_CONTENT },
		undefined
	);

export { createCustomerAccount, getCustomerAccount, deleteCustomerAccount };
