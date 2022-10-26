import processRoute from 'controllers/helpers/process-route';
import db from 'db';
import { ResponseData, Status } from 'types-and-interfaces/routes-processor';
import { StatusCodes } from 'http-status-codes';
const { CREATED, OK, NO_CONTENT } = StatusCodes;

const createQuery = [
		({ userId }) => db.query(`insert into vendor values($1)`, [userId]),
	],
	readQuery = [
		({ userId }) =>
			db.query(`select * from vendor where vendor_id=$1`, [userId]),
	],
	deleteQuery = [() => db.query(`delete from vendor`)],
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

let createVendorAccount = processRoute(createQuery, { status: CREATED }),
	getVendorAccount = processRoute(
		readQuery,
		{ status: OK },
		undefined,
		validateResult
	),
	deleteVendorAccount = processRoute(
		deleteQuery,
		{ status: NO_CONTENT },
		undefined
	);

export { createVendorAccount, getVendorAccount, deleteVendorAccount };
