import { Response } from 'express';
import { RequestWithPayload } from 'types-and-interfaces/request';

export default (
	dbQueries: ((sqlData: object) => any)[],
	validateBody: (data: object) => any
) => {
	return async (request: RequestWithPayload, response: Response) => {
		let userId: string | null = null,
			data: object = {},
			result: { status: number; msg: string } = {
				status: 200,
				msg: 'Route processed successfully',
			};
		if (!request.params) userId = request.user.userId;
		if (request.body) data = validateBody(request.body);
		for (let query of dbQueries) {
			result = query({
				userId,
				params: request.params,
				data,
			});
			if (result.status > 299) break;
		}
		return response.status(result.status).send(result.msg);
	};
};
