import { Response, NextFunction } from 'express'
import UnauthorizedError from '../errors/unauthorized.js'
import {
  RequestWithPayload,
  RequestUserPayload,
} from '../types-and-interfaces/request.js'

export default async (
  request: RequestWithPayload,
  _response: Response,
  next: NextFunction
) => {
  // if route is public, skip authentication
  if (request.query.public === 'true') {
    return next()
  }

  // check header for token
  const authHeader = request.headers.authorization
  if (!authHeader || !authHeader?.startsWith('Bearer '))
    throw new UnauthorizedError('Unauthorized Operation')
  const token = authHeader.split(' ')[1]
  try {
    auth
    next()
  } catch (err) {
    throw new UnauthorizedError('Unauthorized Operation')
  }
}
