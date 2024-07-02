import { Response, NextFunction } from 'express'
import { auth } from '../auth/firebase/index.js'
import UnauthorizedError from '../errors/unauthorized.js'
import { RequestWithPayload } from '../types-and-interfaces/request.js'

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
    const { uid } = await auth.verifyIdToken(token)
    request.uid = uid
    console.log('token verified, uid: ', uid)
    next()
  } catch (err) {
    console.error(err)
    throw new UnauthorizedError('Unauthorized Operation')
  }
}
