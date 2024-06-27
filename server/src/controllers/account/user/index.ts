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
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> =>
  pg.query({
    text: getUserQueryString,
    values: [userId],
  })

/**
 * @description Updates user information.
 **/
const updateQuery = async <T>({
  body,
  userId,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> =>
  knex('users')
    .update({ ...body })
    .where('uid', userId)
    .returning('uid')

/**
 * @description Delete the user account from the database
 **/
const deleteQuery = async <T>({
  userId,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> =>
  knex('users').where('uid', userId).del().returning('uid')

const processPostRoute = <ProcessRoute>createRouteProcessor
const processPatchRoute = <ProcessRoute>createRouteProcessor
const processDeleteRoute = <ProcessRouteWithoutBody>createRouteProcessor
const processGetRoute = <ProcessRouteWithoutBody>createRouteProcessor

export const postUser = processPostRoute({
  Query: createQuery,
  status: CREATED,
  validateBody: validateReqData(UserSchemaRequest),
  validateResult: isSuccessful,
})

export const getUser = processGetRoute({
  Query: getQuery,
  status: OK,
  validateResult: validateResData(UserSchemaDB),
})

export const patchUser = processPatchRoute({
  Query: updateQuery,
  status: OK,
  validateBody: validateReqData(UserSchemaRequest),
  validateResult: isSuccessful,
})

export const deleteUser = processDeleteRoute({
  Query: deleteQuery,
  status: NO_CONTENT,
  validateResult: isSuccessful,
})
