import { StatusCodes } from 'http-status-codes';
import CustomAPIError from 'custom-api';

class ServerError extends CustomAPIError {
	statusCode: number;
	name: string;
	constructor(message: string) {
		super(message);
		this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
		this.name = 'ServerError';
	}
}

export default ServerError;
