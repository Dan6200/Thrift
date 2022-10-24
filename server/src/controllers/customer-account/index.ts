import processRoute from 'controllers/helpers/process-route';
import db from 'db';

const createQuery = [
		({ userId }) => {
			db.query(`insert into customer values($1)`, userId);
		},
	],
	readQuery = [
		({ userId }) => {
			db.query(`select from customer where customer_id=$1`, userId);
		},
	],
	deleteQuery = [() => db.query(`delete from customer`)];

let createCustomerAccount = processRoute(createQuery),
	getCustomerAccount = processRoute(readQuery),
	deleteCustomerAccount = processRoute(deleteQuery);

export { createCustomerAccount, getCustomerAccount, deleteCustomerAccount };
