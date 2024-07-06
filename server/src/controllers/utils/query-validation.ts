import { ArraySchema, ObjectSchema } from 'joi'
import { QueryResult, QueryResultRow } from 'pg'
import BadRequestError from '../../errors/bad-request.js'
import NotFoundError from '../../errors/not-found.js'
import { isTypeQueryResultRow } from '../../types-and-interfaces/response.js'

/**
 * @description Validates data against schema
 */
export const validateReqData =
  <T>(schema: ObjectSchema<T>) =>
  (data: unknown) => {
    console.log('debug data', data)
    if (typeof data == 'undefined' || Object.keys(data)?.length === 0)
      throw new BadRequestError('request data cannot be empty')
    const { error } = schema.validate(data)
    if (error) throw new BadRequestError(error.message)
    return true
  }

/**
 * @description Validates DB result against schema
 * */
export function validateResData<T>(
  schema: ArraySchema<T>
): (result: QueryResult<QueryResultRow | QueryResultRow[]>) => boolean
export function validateResData<T>(
  schema: ObjectSchema<T>
): (result: QueryResult<QueryResultRow | QueryResultRow[]>) => boolean
export function validateResData<T>(schema: ArraySchema<T> | ObjectSchema<T>) {
  return (result: QueryResult<QueryResultRow | QueryResultRow[]>) => {
    if (result.rows?.length === 0) {
      if (result.command === 'SELECT')
        throw new NotFoundError('Requested resource was not found')
      throw new BadRequestError(`${result.command} Operation unsuccessful`)
    }
    let error: Error | undefined
    if (result.rowCount > 1) {
      ;({ error } = schema.validate(result.rows))
    } else {
      ;({ error } = schema.validate(result.rows[0]))
    }
    if (error) throw new BadRequestError(error.message)
    return true
  }
}

/**
 * @description Checks to see if query was successful
 * throws a BadRequestError if it is not
 * */
export const isSuccessful =
  <T>(schema: ObjectSchema<T>) =>
  (result: any[] | QueryResult<QueryResultRow | QueryResultRow[]>): boolean => {
    if (isTypeQueryResultRow(result)) {
      if (result.rows.length === 0)
        throw new BadRequestError(`${result.command} Operation unsuccessful`)
      if (result.rows.length > 1)
        throw new BadRequestError(`${result.command} operated erroneously`)
      const { error } = schema.validate(result.rows[0])
      if (error)
        throw new BadRequestError(`${result.command} Operation unsuccessful`)
    } else {
      if (Array.isArray(result) && result.length === 0)
        throw new BadRequestError(`Operation unsuccessful`)
    }
    return true
  }
