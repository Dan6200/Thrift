import { Response } from 'express'
import { RequestWithPayload } from '../../types-and-interfaces/request.js'
import {
  isValidDBResponse,
  Status,
} from '../../types-and-interfaces/response.js'
import {
  QueryDB,
  QueryParams,
} from '../../types-and-interfaces/process-routes.js'
import BadRequestError from '../../errors/bad-request.js'
import { QueryResult, QueryResultRow } from 'pg'

export default ({
  Query,
  status,
  validateBody,
  validateResult,
}: {
  Query: QueryDB
  status: Status
  validateBody?: <T>(qp: QueryParams<T>) => Promise<void>
  validateResult?: (
    result: QueryResult<QueryResultRow | QueryResultRow[]>
  ) => Promise<void>
}) => {
  // return the route processor middleware
  return async (request: RequestWithPayload, response: Response) => {
    const { params, query, body } = request
    let userId: string | undefined
    if (request.user != null)
      ({
        user: { userId },
      } = request)

    // Validate request data
    if (
      typeof body != 'undefined' &&
      Object.values(body).length !== 0 &&
      validateBody
    ) {
      // validateBody throws error if body is invalid
      await validateBody({ userId, body, params, query })
    }

    const dbResponse: unknown = await Query({ userId, body, params, query })
    if (!isValidDBResponse(dbResponse))
      throw new BadRequestError(`The Database operation could not be completed`)

    if (validateResult) {
      // validateBody throws error if data is invalid
      // check for errors
      await validateResult(dbResponse)
      if (dbResponse.rowCount === 1)
        return response.status(status).json(dbResponse.rows[0])
      return response.status(status).json(dbResponse.rows)
    }
    response.status(status).end()
  }
}
