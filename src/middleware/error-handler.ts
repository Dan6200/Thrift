import { StatusCodes } from 'http-status-codes';
import db from '../db';

const errorHandlerMiddleware = async (err, req, res, next) => {
	let customError = {
		// set default
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || 'Something went wrong try again later',
	};
	console.error(err);
	console.error('last query was ', db.lastQuery);
	return res.status(customError.statusCode).json({
		msg: customError.msg,
	});
};

export default errorHandlerMiddleware;
