import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware = async (
	err: { statusCode: any; message: any },
	_req: any,
	res: {
		status: (arg0: any) => {
			(): any;
			new (): any;
			send: { (arg0: string): void; new (): any };
			json: { (arg0: { msg: any }): any; new (): any };
		};
	},
	_next: any
) => {
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
	console.log(customError.msg);
	return res.status(customError.statusCode).json({
		msg: customError.msg,
	});
};

export default errorHandlerMiddleware;
