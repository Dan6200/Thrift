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
	dbQuery: (sqlData: object) => any,
	responseData: ResponseData,
	validateBody?: (data: object) => any,
	validateResult?: (data: object, status: Status) => ResponseData,
	processData?: (data: object) => any
) => {
	// return the route processor middleware
	return async (request: RequestWithPayload, response: Response) => {
		// variables
		let result: any,
			reqData: any,
			{ userId } = request.user

		if (!userId)
			throw new BadRequestError(
				'Please create the appropriate account before performing this action'
			)
		// set status code and response data
		// Validate request data
		reqData = request.body
		if (
			typeof reqData === 'object' &&
			Object.values(reqData).length &&
			validateBody
		) {
			// validateBody throws error if body is invalid
			reqData = validateBody(reqData)
		}
		// Process the requestData
		if (processData && reqData) reqData = processData(reqData as object)
		let { status, data } = responseData
		// Make a database query with the request data
		result = await dbQuery({
			userId,
			params: request.params,
			query: request.query,
			reqData,
		})
		if (result && validateResult) {
			// validateBody returns error status code and message if data is invalid
			;({ status, data } = validateResult(result, responseData.status))
			// check for errors
			if (status >= 400) return response.status(status).send(data)
		}
		// Update the data with the same status code
		response.status(status).send(data)
	}
}
