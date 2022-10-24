import processRoute from 'controllers/helpers/process-route';
import db from 'db';

const CRUDdbQueries = [
	[
		({ userId }) => {
			db.query(`insert into vendor values($1)`, userId);
		},
	],
	[
		({ userId }) => {
			db.query(`select from vendor where vendor_id=$1`, userId);
		},
	],
	[() => db.query(`delete from vendor`)],
];

let createVendorAccount = processRoute(CRUDdbQueries[0]),
	getVendorAccount = processRoute(CRUDdbQueries[1]),
	deleteVendorAccount = processRoute(CRUDdbQueries[2]);

export { createVendorAccount, getVendorAccount, deleteVendorAccount };
