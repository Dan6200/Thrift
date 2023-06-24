import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import { Response, NextFunction } from 'express'
import UnauthenticatedError from '../errors/unauthenticated.js'
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
	// check header
	const authHeader = request.headers.authorization
	console.log(authHeader)
	if (!authHeader || !authHeader?.startsWith('Bearer '))
		throw new UnauthenticatedError('Authentication invalid')
	const token = authHeader?.split(' ')[1]
	if (await isTokenRevoked(token))
		throw new UnauthenticatedError('Unauthorized')
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET as Secret)
		request.user = payload as JwtPayload as RequestUserPayload
		next()
	} catch (err) {
		throw new UnauthenticatedError('Authentication invalid')
	}
}
