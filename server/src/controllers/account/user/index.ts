import { StatusCodes } from 'http-status-codes'
import {
  ProcessRoute,
  ProcessRouteWithoutBody,
  QueryParams,
} from '../../../types-and-interfaces/process-routes.js'
import createRouteProcessor from '../../routes/process.js'
import { knex, pg } from '../../../db/index.js'
import { QueryResult, QueryResultRow } from 'pg'
import {
  isSuccessful,
  validateReqData,
  validateResData,
} from '../../utils/query-validation.js'
import { UserSchemaDB, UserSchemaRequest } from '../../../app-schema/users.js'
import { getUserQueryString } from './utils.js'

const { OK, CREATED, NO_CONTENT } = StatusCodes

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
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> => {
  return pg.query({
    text: getUserQueryString,
    values: [userId],
  })
}

/**
 * @description Delete the user account from the database
 **/
const deleteQuery = async <T>({
  userId,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> =>
  knex('users').where('uid', userId).del().returning('uid')

const processPostRoute = <ProcessRoute>createRouteProcessor
const processDeleteRoute = <ProcessRouteWithoutBody>createRouteProcessor
const processGetRoute = <ProcessRouteWithoutBody>createRouteProcessor

export const createUserAccount = processPostRoute({
  Query: createQuery,
  status: CREATED,
  validateBody: validateReqData(UserSchemaRequest),
  validateResult: isSuccessful,
})

export const getUserAccount = processGetRoute({
  Query: getQuery,
  status: OK,
  validateResult: validateResData(UserSchemaDB),
})

export const deleteUserAccount = processDeleteRoute({
  Query: deleteQuery,
  status: NO_CONTENT,
  validateResult: isSuccessful,
})
