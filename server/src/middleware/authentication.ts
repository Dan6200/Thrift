import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import { Response, NextFunction } from 'express'
import UnauthorizedError from '../errors/unauthorized.js'
import {
  RequestWithPayload,
  RequestUserPayload,
} from '../types-and-interfaces/request.js'
import dotenv from 'dotenv'
import { isTokenRevoked } from '../controllers/helpers/revoke-token.js'
dotenv.config()

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
  if (await isTokenRevoked(token))
    throw new UnauthorizedError('Unauthorized Operation')
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as Secret)
    request.user = payload as JwtPayload as RequestUserPayload
    next()
  } catch (err) {
    throw new UnauthorizedError('Unauthorized Operation')
  }
}
