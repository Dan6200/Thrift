import { Response } from 'express';
import { RequestWithPayload } from 'types-and-interfaces/request';

// TODO: scrutinize this function
export default (
	dbQueries: ((sqlData: object) => any)[],
	validateBody: (data: object) => any,
	validateResult: (data: object) => any,
	processData: (data: object) => any
) => {
	return async (request: RequestWithPayload, response: Response) => {
		let userId: string | null = null,
			requestData: object = {},
			result: { status: number; data: string | object } = {
				status: 200,
				data: {},
			};
		userId = request.user.userId;
		if (request.body) requestData = validateBody(request.body);
		for (let query of dbQueries) {
			result = query({
				userId,
				params: request.params,
				requestData,
			});
			result && validateResult(result);
		}
		return response.status(result.status).send(result.data);
	};
};
