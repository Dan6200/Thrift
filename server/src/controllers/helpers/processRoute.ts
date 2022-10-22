import { Response } from 'express';
import { RequestWithPayload } from 'types-and-interfaces/request';

// TODO: scrutinize this function
export default (
	dbQueries: ((sqlData: object) => any)[],
	validateBody: ((data: object) => any) | null,
	validateResult: ((data: object) => any) | null,
	processData: ((data: object) => any) | null
) => {
	return async (request: RequestWithPayload, response: Response) => {
		let userId: string | null = null,
			requestData: object = {},
			result: { status: number; data: string | object } = {
				status: 200,
				data: {},
			};
		userId = request.user.userId;
		// Validate request data
		if (request.body && validateBody)
			requestData = validateBody(request.body);
		// Process the requestData
		if (processData) requestData = processData(requestData);
		for (let query of dbQueries) {
			result = query({
				userId,
				params: request.params,
				requestData,
			});
			result && validateResult && validateResult(result);
		}
		return response.status(result.status).send(result.data);
	};
};
