import { StatusCodes } from 'http-status-codes';
import db from '../../../db';
import {
	Status,
	ResponseData,
} from '../../../types-and-interfaces/routes-processor';
import processRoute from '../../helpers/process-route';
const { CREATED, OK, NO_CONTENT } = StatusCodes;

const createQuery = [
		({ userId }) =>
			db.query(`insert into vendor values($1) returning vendor_id`, [
				userId,
			]),
	],
	readQuery = [
		({ userId }) =>
			db.query(`select * from vendor where vendor_id=$1`, [userId]),
	],
	deleteQuery = [() => db.query(`delete from vendor`)],
	validateResult = (result: any, status: Status): ResponseData => {
		if (result.rowCount === 0) {
			if (result.command === 'SELECT') {
				return {
					status: 404,
					data: 'Route does not exit',
				};
			}
			if (result.command === 'INSERT')
				throw new Error('INSERT operation failed');
		}
		return {
			status,
			data: result.rows[result.rowCount - 1],
		};
	};

let createVendorAccount = processRoute(
		createQuery,
		{ status: CREATED },
		undefined,
		validateResult
	),
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
