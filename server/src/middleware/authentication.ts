import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { UnauthenticatedError } from '../errors';
import {
	RequestUserPayload,
	RequestWithPayload,
} from '../types-and-interfaces/request';

export default async (
	request: RequestWithPayload,
	_response: Response,
	next: NextFunction
) => {
	// check header
	const authHeader = request.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer '))
		throw new UnauthenticatedError('Authentication invalid');
	const token = authHeader.split(' ')[1];
	if (token === 'null')
		throw new UnauthenticatedError('Authentication invalid');
	try {
		const payload = jwt.verify(
			token,
			process.env.JWT_SECRET
		) as RequestUserPayload;
		// console.log('payload %o: ', payload, fileName);
		request.user = payload;
		next();
	} catch (err) {
		throw new UnauthenticatedError('Authentication invalid');
	}
};
