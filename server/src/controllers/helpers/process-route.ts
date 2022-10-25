import { Response } from 'express';
import { RequestWithPayload } from 'types-and-interfaces/request';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
// const filename = path.join(path.basename(__dirname), path.basename(__filename));

// TODO: scrutinize this function
const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes;
type responseData = {
	status: typeof CREATED | typeof OK | typeof NO_CONTENT | typeof NOT_FOUND;
	data?: string | object;
};
export default (
	dbQueries: ((sqlData: object) => any)[],
	{ status, data }: responseData,
	validateBody?: (data: object) => any,
	validateResult?: (data: object) => responseData,
	processData?: (data: object) => any
) => {
	// return the route processor middleware
	return async (request: RequestWithPayload, response: Response) => {
		// variables
		let result: any,
			{ userId } = request.user;
		// Validate request data
		if (request.body && validateBody)
			// validateBody returns error status code and message if body is invalid
			({ status, data } = validateBody(request.body));
		// check for errors
		if (status >= 400) return response.status(status).send(data);
		// Process the requestData
		if (processData && data) data = processData(data as object);
		for (let query of dbQueries) {
			result = await query({
				userId,
				params: request.params,
				data,
			});
			if (result && validateResult) {
				// validateBody returns error status code and message if data is invalid
				({ status, data } = validateResult(result));
				// check for errors
				if (status >= 400) return response.status(status).send(data);
			}
		}
		response.status(status).send(data);
	};
};
