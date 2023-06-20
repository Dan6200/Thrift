import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import BadRequestError from '../../errors/bad-request.js'
import { RequestWithPayload } from '../../types-and-interfaces/request.js'

const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes

type Status = typeof CREATED | typeof OK | typeof NO_CONTENT | typeof NOT_FOUND

type ResponseData = {
	status: Status
	data?: string | object
}
export default (
	dbQuery: (reqData: {
		userId: string
		query: object
		params: object
		reqBody: object
	}) => any,
	status: Status,
	validateBody?: (data: object) => any,
	validateResult?: (data: object, status: Status) => ResponseData
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
			;({ status, data } = validateResult(dbRes, status))
		}
		data ??= null
		// Update the data with the same status code
		response.status(status).send(data)
	}
}
