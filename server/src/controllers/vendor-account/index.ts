import processRoute from 'controllers/helpers/process-route';
import db from 'db';

const createQuery = [
	({ userId }) => {
		db.query(`insert into vendor values($1)`, userId);
	},
];

const readQuery = [
	({ userId }) => {
		db.query(`select from vendor where vendor_id=$1`, userId);
	},
];

const deleteQuery = [() => db.query(`delete from vendor`)];

let createVendorAccount = processRoute(createQuery),
	getVendorAccount = processRoute(readQuery),
	deleteVendorAccount = processRoute(deleteQuery);

export { createVendorAccount, getVendorAccount, deleteVendorAccount };
