import processRoute from 'controllers/helpers/process-route';
import db from 'db';
import { StatusCodes } from 'http-status-codes';
const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes;
type responseData = {
	status: typeof CREATED | typeof OK | typeof NO_CONTENT | typeof NOT_FOUND;
	data?: string | object;
};

const createQuery = [
		({ userId }) => db.query(`insert into customer values($1)`, [userId]),
	],
	readQuery = [
		({ userId }) =>
			db.query(`select * from customer where customer_id=$1`, [userId]),
	],
	deleteQuery = [() => db.query(`delete from customer`)],
	validateResult = (result: any): responseData => {
		if (result.rowCount === 0)
			return {
				status: 404,
				data: 'Route does not exit',
			};
		return {
			status: 404,
			data: result.rows[result.rowCount - 1],
		};
	};

let createCustomerAccount = processRoute(createQuery, { status: CREATED }),
	getCustomerAccount = processRoute(
		readQuery,
		{ status: OK },
		validateResult
	),
	deleteCustomerAccount = processRoute(
		deleteQuery,
		{ status: NO_CONTENT },
		validateResult
	);

export { createCustomerAccount, getCustomerAccount, deleteCustomerAccount };
