import util from 'util'
import { Response } from 'express'
import { ParsedQs } from 'qs'
import { RequestWithPayload } from '../../types-and-interfaces/request.js'
import { ResponseData, Status } from '../../types-and-interfaces/response.js'

export default <T>({
  Query,
  status,
  validateBody,
  validateResult,
}: {
  Query: (queryData: {
    userId?: string
    body?: Record<string, T>
    params?: Record<string, string>
    query?: ParsedQs
  }) => Promise<Record<string, T>>
  status: Status
  validateBody?: <T>(body: T) => Promise<void>
  validateResult?: (result: Record<string, T>) => Promise<void>
}) => {
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
    //
    const {
      user: { userId },
      params,
      query,
    } = request
    const dbRes = await Query({ userId, body, params, query })

    if (validateResult) {
      // validateBody returns error status code and message if data is invalid
      // check for errors
      await validateResult(dbRes)
      return response.status(status).json({ dbRes, rowCount: dbRes.rowCount })
    }
    response.status(status).end()
  }
}
