import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { QueryResult } from 'pg'
import BadRequestError from '../../errors/bad-request.js'
import { RequestWithPayload } from '../../types-and-interfaces/request.js'
import { ResponseData } from '../../types-and-interfaces/response.js'

const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes

type Status = typeof CREATED | typeof OK | typeof NO_CONTENT | typeof NOT_FOUND

export default (
	dbQuery: (reqData: {
		userId?: string
		query?: object
		params?: object
		reqBody?: object
	}) => Promise<QueryResult<any>>,
	status: Status,
	validateBody?: (data: any) => object,
	validateResult?: (data: any) => ResponseData
) => {
	// return the route processor middleware
	return async (request: RequestWithPayload, response: Response) => {
		let { userId } = request.user
		if (!userId)
			throw new BadRequestError(
				'Please create the appropriate account before performing this action'
			)
		// set status code and response data
		// Validate request data
		let reqBody = request.body
		if (
			typeof reqBody === 'object' &&
			Object.values(reqBody).length &&
			validateBody
		) {
			// validateBody throws error if body is invalid
			reqBody = validateBody(reqBody)
		}
		// Process the requestData
		// Make a database query with the request data
		const dbRes = await dbQuery({
			userId,
			params: request.params,
			query: request.query,
			reqBody,
		})

		if (validateResult) {
			// validateBody returns error status code and message if data is invalid
			// check for errors
			const { status: errStatus, data } = validateResult(dbRes)
			return response.status(errStatus ?? status).send(data)
		}
		response.status(status).end()
	}
}
