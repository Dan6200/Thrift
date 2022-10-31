import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware = async (err, req, res, next) => {
	let customError = {
		// set default
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || 'Something went wrong try again later',
	};
	console.log(err);
	if (customError.statusCode === StatusCodes.NOT_FOUND)
		res.status(customError.statusCode).send(
			`<h1>
			${customError.msg}
		</h1>
	`
		);
	return res.status(customError.statusCode).json({
		msg: customError.msg,
	});
};

export default errorHandlerMiddleware;
