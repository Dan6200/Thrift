import { ArraySchema, ObjectSchema } from 'joi'
import { QueryResult, QueryResultRow } from 'pg'
import BadRequestError from '../../errors/bad-request.js'
import NotFoundError from '../../errors/not-found.js'
import { QueryParams } from '../../types-and-interfaces/process-routes.js'

/**
 * @description Validates data against schema
 */
export const validateReqData =
  <T>(schema: ObjectSchema<T>) =>
  async <T>({ body }: QueryParams<T>) => {
    if (typeof body == 'undefined' || Object.keys(body).length === 0)
      throw new BadRequestError('request data cannot be empty')
    const { error } = schema.validate(body)
    if (error) throw new BadRequestError(error.message)
  }

/**
 * @description Validates DB result against schema
 * */
export function validateResData<T>(
  schema: ArraySchema<T>
): (result: QueryResult<QueryResultRow | QueryResultRow[]>) => Promise<void>
export function validateResData<T>(
  schema: ObjectSchema<T>
): (result: QueryResult<QueryResultRow | QueryResultRow[]>) => Promise<void>
export function validateResData<T>(schema: ArraySchema<T> | ObjectSchema<T>) {
  return async (result: QueryResult<QueryResultRow | QueryResultRow[]>) => {
    if (result.rows.length === 0) {
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
  }
}

/**
 * @description Checks to see if query was successful
 * throws a BadRequestError if it is not
 * */
export const isSuccessful =
  <T>(schema: ObjectSchema<T>) =>
  async (
    result: QueryResult<QueryResultRow | QueryResultRow[]>
  ): Promise<void> => {
    if (result.rows.length === 0)
      throw new BadRequestError(`${result.command} Operation unsuccessful`)
    if (result.rows.length > 1)
      throw new BadRequestError(`${result.command} operated erroneously`)
    const { error } = schema.validate(result.rows[0])
    if (error)
      throw new BadRequestError(`${result.command} Operation unsuccessful`)
  }
