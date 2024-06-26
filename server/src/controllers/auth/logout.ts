/*
 * Switching to Firebase Auth
 *
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import UnauthorizedError from '../../errors/unauthorized.js'
import { revokeToken } from '../helpers/revoke-token.js'

export default async (request: Request, response: Response) => {
  const authHeader = request.headers.authorization
  if (!authHeader || !authHeader?.startsWith('Bearer '))
    throw new UnauthorizedError('Unauthorized Operation')
  const token = authHeader.split(' ')[1]
  await revokeToken(token)
  response.status(StatusCodes.OK).end()
}
*/
