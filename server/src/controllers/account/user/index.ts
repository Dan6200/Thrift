import { StatusCodes } from 'http-status-codes'
import {
  ProcessRoute,
  ProcessRouteWithoutBody,
  QueryParams,
} from '../../../types-and-interfaces/process-routes.js'
import createRouteProcessor from '../../routes/process.js'
import { knex } from '../../../db/index.js'
import { QueryResult, QueryResultRow } from 'pg'
import { isSuccessful, validateReqData } from '../../utils/query-validation.js'
import { UserSchemaRequest } from '../../../app-schema/users.js'

const { CREATED, NO_CONTENT } = StatusCodes

/**
 * @description Add a user account to the database
 **/
const createQuery = async <T>({
  body,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> =>
  knex('users')
    .insert({ ...body })
    .returning('uid')

/**
 * @description Retrieves user information.
 **/
const getQuery = async <T>({
  userId,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>[]> =>
  knex.select('*').from('users').where('uid', userId)

/**
 * @description Delete the user account from the database
 **/
const deleteQuery = async <T>({
  userId,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> =>
  knex('users').where('uid', userId).del().returning('uid')

const processPostRoute = <ProcessRoute>createRouteProcessor
const processDeleteRoute = <ProcessRouteWithoutBody>createRouteProcessor

const createUserAccount = processPostRoute({
  Query: createQuery,
  status: CREATED,
  validateBody: validateReqData(UserSchemaRequest),
  validateResult: isSuccessful,
})

const deleteUserAccount = processDeleteRoute({
  Query: deleteQuery,
  status: NO_CONTENT,
  validateResult: isSuccessful,
})

export { createUserAccount, deleteUserAccount }
