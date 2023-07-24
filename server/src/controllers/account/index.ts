import db from '../../db/pg/index.js'
import { StatusCodes } from 'http-status-codes'
import BadRequestError from '../../errors/bad-request.js'
import UnauthorizedError from '../../errors/unauthorized.js'
import { hashPassword } from '../../security/password.js'
import {
  UpdateRecord,
  DeleteRecord,
} from '../helpers/generate-sql-commands/index.js'
import {
  AccountDataSchemaDB,
  UpdateAccountDataSchema,
} from '../../app-schema/account.js'
import {
  ProcessRoute,
  ProcessRouteWithoutBody,
  QueryParams,
} from '../../types-and-interfaces/process-routes.js'
import processRoute from '../helpers/process-route.js'
import {
  isSuccessful,
  validateReqData,
  validateResData,
} from '../helpers/query-validation.js'
import {
  getUserQueryString,
  passwdDataIsValid,
  userIdIsNotNull,
  validatePasswordData,
} from './supporting-funcs-and-vars.js'
import { QueryResult, QueryResultRow } from 'pg'

const getQuery = async <T>({
  userId,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow[]>> => {
  return db.query({
    text: getUserQueryString,
    values: [userId],
  })
}

const updateQuery = <T>({ userId, body }: QueryParams<T>) => {
  if (body == null) throw new BadRequestError('request data cannot be empty')
  if (Object.hasOwn(body, 'password'))
    throw new BadRequestError('Cannot update password here')
  let fields: string[] = Object.keys(body),
    data: any[] = Object.values(body)
  return db.query({
    text: UpdateRecord('user_accounts', 'user_id', fields, 2, `user_id=$1`),
    values: [userId, ...data],
  })
}

const updatePasswordQuery = async <T>({
  userId,
  body,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow | QueryResultRow[]>> => {
  // type guards
  if (!userIdIsNotNull(userId))
    throw new UnauthorizedError('Must be logged in to update password')
  if (!passwdDataIsValid(body))
    throw new BadRequestError('Provide current password and new password')

  const { new_password: newPassword } = body
  const hashedPassword = await hashPassword(newPassword)
  return db.query({
    text: UpdateRecord(
      'user_accounts',
      'user_id',
      ['password'],
      2,
      `user_id=$1`
    ),
    values: [userId, hashedPassword],
  })
}

const deleteQuery = <T>({ userId }: QueryParams<T>) =>
  db.query({
    text: DeleteRecord('user_accounts', ['user_id'], `user_id=$1`),
    values: [userId],
  })

const { OK, NO_CONTENT } = StatusCodes

// Type assertions
const processGetRoute = <ProcessRouteWithoutBody>processRoute
const processUpdateRoute = <ProcessRoute>processRoute
const processDeleteRoute = <ProcessRouteWithoutBody>processRoute

const getUserAccount = processGetRoute({
  Query: getQuery,
  status: OK,
  validateBody: undefined,
  validateResult: validateResData(AccountDataSchemaDB),
})

const updateUserPassword = processUpdateRoute({
  Query: updatePasswordQuery,
  status: NO_CONTENT,
  validateBody: validatePasswordData,
  validateResult: isSuccessful,
})

const updateUserAccount = processUpdateRoute({
  Query: updateQuery,
  status: OK,
  validateBody: validateReqData(UpdateAccountDataSchema),
  validateResult: isSuccessful,
})

const deleteUserAccount = processDeleteRoute({
  Query: deleteQuery,
  status: NO_CONTENT,
  validateBody: undefined,
  validateResult: isSuccessful,
})

export {
  getUserAccount,
  updateUserAccount,
  updateUserPassword,
  deleteUserAccount,
}
