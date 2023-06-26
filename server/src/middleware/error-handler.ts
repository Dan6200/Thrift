import { StatusCodes } from 'http-status-codes'
import { NextFunction, Request, Response } from 'express'
import { error } from 'console'

const errorHandlerMiddleware = async (
	err: { statusCode: StatusCodes; message: 'string' },
	_req: Request,
	res: Response,
	_next: NextFunction // Must have these 4 params to work
) => {
	// error logging
	error(err)

	let customError = {
		// set default
		statusCode: err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
		message: err.message ?? 'Something went wrong try again later',
	}
	return res.status(customError.statusCode).json({
		message: customError.message,
	})
}

export default errorHandlerMiddleware
