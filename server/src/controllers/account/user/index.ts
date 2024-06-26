import { StatusCodes } from 'http-status-codes'
import { QueryResult, QueryResultRow } from 'pg'
import db from '../../../db/index.js'
import BadRequestError from '../../../errors/bad-request.js'
import { createToken } from '../../../security/create-token.js'
import { hashPassword } from '../../../security/password.js'
import { AccountData } from '../../../types-and-interfaces/account.js'
import { isValidDBResponse } from '../../../types-and-interfaces/response.js'
import { InsertRecord } from '../../helpers/generate-sql-commands/index.js'
import { validateAccountData } from '../../helpers/validateAccountData.js'

const { CREATED } = StatusCodes

/*
 * @param {Request} request
 * @param {Response} response
 * @returns {Promise<void>}
 * @description Create a new user account
 * @todo: Validate email and phone number through Email and SMS
 */
export default async (request: Request, response: Response): Promise<void> => {
  // validate the users account data
  const userData: AccountData = await validateAccountData(
    request.body as AccountData
  )
  const { password } = userData
  userData.password = await hashPassword(<string>password)
  let dbResponse: unknown = await db.query({
    text: InsertRecord('user_accounts', Object.keys(userData), 'user_id'),
    values: Object.values(userData),
  })
  if (!isValidDBResponse(dbResponse))
    throw new Error('Unable to register user account')
  const { rows } = dbResponse as QueryResult<QueryResultRow>
  const { user_id: userId } = rows[0]
  if (userId == null)
    throw new BadRequestError('Unable to register user account')
  // create a token for the user
  const token = createToken(userId)
  response.status(CREATED).json({
    token,
  })
}
