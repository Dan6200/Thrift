import { StatusCodes } from 'http-status-codes'
import { QueryResult, QueryResultRow } from 'pg'

const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes
type Status = typeof CREATED | typeof OK | typeof NO_CONTENT | typeof NOT_FOUND

type ResponseData = {
  status?: Status
  data?: string | object
}

export function isValidDBResponse(
  dbResponse: unknown
): dbResponse is QueryResult<QueryResultRow> {
  return (
    dbResponse != undefined &&
    typeof dbResponse === 'object' &&
    Object.keys(dbResponse).length !== 0 &&
    'rows' in dbResponse &&
    'command' in dbResponse &&
    'rowCount' in dbResponse &&
    'oid' in dbResponse &&
    'fields' in dbResponse
  )
}

export { Status, ResponseData }
