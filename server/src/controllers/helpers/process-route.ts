import util from 'util'
import { Response } from 'express'
import { QueryResult, QueryResultRow } from 'pg'
import { RequestWithPayload } from '../../types-and-interfaces/request.js'
import { ResponseData, Status } from '../../types-and-interfaces/response.js'

export default (
	CRUDQuery: (
		queryData: RequestWithPayload
	) => Promise<QueryResult<QueryResultRow>>,
	status: Status,
	validateBody?: <T>(body: T) => Promise<void>,
	validateResult?: (
		result: QueryResult<QueryResultRow>
	) => Promise<ResponseData>
) => {
	// return the route processor middleware
	return async (request: RequestWithPayload, response: Response) => {
		const { body } = request
		// set status code and response data
		// Validate request data
		if (
			typeof body === 'object' &&
			Object.values(body).length &&
			validateBody
		) {
			// validateBody throws error if body is invalid
			await validateBody(body)
		}
		// Process the requestData
		// Make a database query with the request data
		const dbRes = await CRUDQuery(request)

		if (validateResult) {
			// validateBody returns error status code and message if data is invalid
			// check for errors
			const { status: errStatus, data } = await validateResult(dbRes)
			return response.status(errStatus ?? status).send(data)
		}
		response.status(status).end()
	}
}
