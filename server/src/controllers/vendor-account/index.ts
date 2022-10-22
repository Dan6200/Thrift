import processRoute from 'controllers/helpers/processRoute';
import db from 'db';
import { BadRequestError } from 'errors';

// might need to be a 2d array, one for each route controller, and then the queries made by each controller
let dbQueries = [
	async ({ userId }) => {
		await db.query(``, [userId]);
	},
];

let validateBody = (data: object): object => {
	const validData = VendorSchemaReq.validate(data);
	if (validData.error)
		throw new BadRequestError(
			'Invalid Data Schema: ' + validData.error.message
		);
	return validData.value;
};

let createVendor = processRoute(dbQueries, validateBody);
