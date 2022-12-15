import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

const errorHandlerMiddleware = async (
	err: { statusCode: any; message: any },
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	console.error(err);
	let customError = {
		// set default
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || 'Something went wrong try again later',
	};
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
