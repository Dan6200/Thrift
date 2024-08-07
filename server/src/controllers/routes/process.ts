import { Response } from 'express'
import { RequestWithPayload } from '../../types-and-interfaces/request.js'
import {
  isTypeQueryResultRow,
  Status,
} from '../../types-and-interfaces/response.js'
import { QueryDB } from '../../types-and-interfaces/process-routes.js'
import BadRequestError from '../../errors/bad-request.js'
import { QueryResult, QueryResultRow } from 'pg'
import NotFoundError from '../../errors/not-found.js'

export default ({
  Query,
  QueryForwarder,
  status,
  validateBody,
  validateResult,
}: {
  Query: QueryDB
  QueryForwarder?: (s: string) => QueryDB
  status: Status
  validateBody?: <T>(body: T) => boolean
  validateResult?: (
    result: any[] | QueryResult<QueryResultRow | QueryResultRow[]>
  ) => boolean
}) => {
  // return the route processor middleware
  return async (request: RequestWithPayload, response: Response) => {
    const { params, query, body } = request
    let uid: string | undefined
    if (request.uid != null) ({ uid } = request)

    // Validate request data
    if (
      typeof body != 'undefined' &&
      Object.values(body).length !== 0 &&
      validateBody
    ) {
      // validateBody throws error if body is invalid
      validateBody(body)
    }

    let dbResponse: unknown
    if (QueryForwarder) {
      // Call the correct query handler based on route is public or not
      const publicQuery = <string>query!.public
      dbResponse = await QueryForwarder(publicQuery)({
        uid,
        body,
        params,
        query,
      })
    } else {
      // remove password
      const { password, ...bodyWithoutPassword } = body
      dbResponse = await Query({
        uid,
        body: bodyWithoutPassword,
        params,
        query,
      })
    }

    if (!isTypeQueryResultRow(dbResponse) && !Array.isArray(dbResponse)) {
      console.log(typeof dbResponse, dbResponse)
      throw new BadRequestError(`The Database operation could not be completed`)
    }

    if (validateResult) {
      // validateBody throws error if data is invalid
      // check for errors returns true if response is valid
      if (!validateResult(dbResponse)) {
        if (Query?.name.match(/get/) || QueryForwarder?.name.match(/get/)) {
          if (Array.isArray(dbResponse) && dbResponse.length === 0)
            throw new NotFoundError('The Requested Resource Could not be found')
        }
        throw new BadRequestError('Invalid Database Response')
      }
      let responseData: any = null
      if (isTypeQueryResultRow(dbResponse)) {
        if (dbResponse.rowCount === 1) responseData = dbResponse.rows[0]
        else responseData = dbResponse.rows
      }
      if (Array.isArray(dbResponse)) {
        if (dbResponse.length === 1) responseData = dbResponse[0]
        else responseData = dbResponse
      }
      return response.status(status).json(responseData)
    }
    response.status(status).end()
  }
}
