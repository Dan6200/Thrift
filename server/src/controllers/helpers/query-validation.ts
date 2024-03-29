import util from 'node:util'
import Joi, { ArraySchema, ObjectSchema } from 'joi'
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
 * @description Validates DB response against schema
 * */
export function validateResData<T>(
  schema: ArraySchema<T>
): (response: QueryResult<QueryResultRow | QueryResultRow[]>) => Promise<void>
export function validateResData<T>(
  schema: ObjectSchema<T>
): (response: QueryResult<QueryResultRow | QueryResultRow[]>) => Promise<void>
export function validateResData<T>(schema: ArraySchema<T> | ObjectSchema<T>) {
  return async (response: QueryResult<QueryResultRow | QueryResultRow[]>) => {
    if (response.rows.length === 0) {
      if (response.command === 'SELECT')
        throw new NotFoundError('Requested resource was not found')
      throw new BadRequestError(`${response.command} Operation unsuccessful`)
    }
    let error: Error | undefined
    if (response.rowCount > 1) {
      ;({ error } = schema.validate(response.rows))
    } else {
      ;({ error } = schema.validate(response.rows[0]))
    }
    if (error) throw new BadRequestError(error.message)
  }
}

/**
 * @description Checks to see if query was successful
 * If the result is empty, throw an error
 * */
export const isSuccessful = async (
  result: QueryResult<QueryResultRow | QueryResultRow[]>
): Promise<void> => {
  if (result.rows.length === 0)
    throw new BadRequestError(`${result.command} Operation unsuccessful`)
}
