import processRoute from 'controllers/helpers/process-route';
import db from 'db';

const CRUDdbQueries = [
	[
		({ userId }) => {
			db.query(`insert into customer values($1)`, userId);
		},
	],
	[
		({ userId }) => {
			db.query(`select from customer where customer_id=$1`, userId);
		},
	],
	[() => db.query(`delete from customer`)],
];

let createCustomerAccount = processRoute(CRUDdbQueries[0]),
	getCustomerAccount = processRoute(CRUDdbQueries[1]),
	deleteCustomerAccount = processRoute(CRUDdbQueries[2]);

export { createCustomerAccount, getCustomerAccount, deleteCustomerAccount };
