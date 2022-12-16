import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api';

class BadRequestError extends CustomAPIError {
	statusCode: number;
	name: string;
	constructor(message: string) {
		super(message);
		this.statusCode = StatusCodes.BAD_REQUEST;
		this.name = 'BadRequestError';
	}
}

export default BadRequestError;
