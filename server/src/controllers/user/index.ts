import { StatusCodes } from 'http-status-codes'
import {
  ProcessRoute,
  ProcessRouteWithoutBody,
  QueryParams,
} from '../../types-and-interfaces/process-routes.js'
import createRouteProcessor from '../routes/process.js'
import { knex, pg } from '../../db/index.js'
import { QueryResult, QueryResultRow } from 'pg'
import {
  isSuccessful,
  validateReqData,
  validateResData,
} from '../utils/query-validation.js'
import { getUserQueryString } from './utils.js'
import {
  UIDSchema,
  UserRequestSchema,
  UserResponseSchema,
  UserUpdateRequestSchema,
} from '../../app-schema/users.js'

const { OK, CREATED } = StatusCodes

/**
 * @description Add a user account to the database
 **/
const createQuery = async <T>({
  uid,
  body,
}: QueryParams<T>): Promise<typeof uid> =>
  knex('users')
    .insert({ uid, ...body })
    .returning('uid')

/**
 * @description Retrieves user information.
 **/
const getQuery = async <T>({
  uid,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> =>
  pg.query(getUserQueryString, [uid])

/**
 * @description Updates user information.
 **/
const updateQuery = async <T>({
  body,
  uid,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> =>
  knex('users')
    .update({ ...body })
    .where('uid', uid)
    .returning('uid')

/**
 * @description Delete the user account from the database
 **/
const deleteQuery = async <T>({ uid }: QueryParams<T>): Promise<typeof uid> =>
  knex('users').where('uid', uid).del().returning('uid')

const processPostRoute = <ProcessRoute>createRouteProcessor
const processPatchRoute = <ProcessRoute>createRouteProcessor
const processDeleteRoute = <ProcessRouteWithoutBody>createRouteProcessor
const processGetRoute = <ProcessRouteWithoutBody>createRouteProcessor

export const postUser = processPostRoute({
  Query: createQuery,
  status: CREATED,
  validateBody: validateReqData(UserRequestSchema),
  validateResult: isSuccessful(UIDSchema),
})

export const getUser = processGetRoute({
  Query: getQuery,
  status: OK,
  validateResult: validateResData(UserResponseSchema),
})

export const patchUser = processPatchRoute({
  Query: updateQuery,
  status: OK,
  validateBody: validateReqData(UserUpdateRequestSchema),
  validateResult: isSuccessful(UIDSchema),
})

export const deleteUser = processDeleteRoute({
  Query: deleteQuery,
  status: OK,
  validateResult: isSuccessful(UIDSchema),
})
