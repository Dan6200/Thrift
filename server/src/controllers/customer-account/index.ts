import processRoute from 'controllers/helpers/process-route';
import db from 'db';
import { StatusCodes } from 'http-status-codes';
const { OK, CREATED, NO_CONTENT } = StatusCodes;

const createQuery = [
		({ userId }) => db.query(`insert into customer values($1)`, [userId]),
	],
	readQuery = [
		({ userId }) =>
			db.query(`select * from customer where customer_id=$1`, [userId]),
	],
	deleteQuery = [() => db.query(`delete from customer`)];

let createCustomerAccount = processRoute(createQuery, { status: CREATED }),
	getCustomerAccount = processRoute(readQuery, { status: OK }),
	deleteCustomerAccount = processRoute(deleteQuery, { status: NO_CONTENT });

export { createCustomerAccount, getCustomerAccount, deleteCustomerAccount };
