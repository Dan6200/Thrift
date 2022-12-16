import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
import { RequestWithPayload } from '../../types-and-interfaces/request';
const filename = path.join(path.basename(__dirname), path.basename(__filename));

const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes;

type Status = typeof CREATED | typeof OK | typeof NO_CONTENT | typeof NOT_FOUND;

type ResponseData = {
	status: Status;
	data?: string | object;
};
export default (
	dbQueries: ((sqlData: object) => any)[],
	responseData: ResponseData,
	validateBody?: (data: object) => any,
	validateResult?: (data: object, status: Status) => ResponseData,
	processData?: (data: object) => any
) => {
	// return the route processor middleware
	debugger;
	return async (request: RequestWithPayload, response: Response) => {
		// variables
		let result: any,
			reqData: any,
			{ userId } = request.user;
		// set status code and response data
		// Validate request data
		// debugger;
		reqData = request.body;
		if (
			typeof reqData === 'object' &&
			Object.values(reqData).length &&
			validateBody
		) {
			// validateBody throws error if body is invalid
			reqData = validateBody(reqData);
		}
		// Process the requestData
		if (processData && reqData) reqData = processData(reqData as object);
		let { status, data } = responseData;
		// Make a database query with the request data
		for (let query of dbQueries) {
			result = await query({
				userId,
				params: request.params,
				reqData,
			});
			if (result && validateResult) {
				// validateBody returns error status code and message if data is invalid
				({ status, data } = validateResult(
					result,
					responseData.status
				));
				// check for errors
				if (status >= 400) return response.status(status).send(data);
			}
		}
		// Update the data with the same status code
		response.status(status).send(data);
	};
};
