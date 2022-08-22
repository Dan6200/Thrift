import jwt from 'jsonwebtoken';
import { RequestWithPayload, UserPayload } from '../types-and-interfaces';
import { Response, NextFunction } from 'express';
import db from '../db';
import { UnauthenticatedError } from '../errors';
import path from 'path';

let fileName = path.basename(__filename);

export default async (
	request: RequestWithPayload,
	response: Response,
	next: NextFunction
) => {
	// check header
	const authHeader = request.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer '))
		throw new UnauthenticatedError('Authentication invalid');
	const token = authHeader.split(' ')[1];
	try {
		const payload = jwt.verify(
			token,
			process.env.JWT_SECRET
		) as UserPayload;
		// attach the user id to the Job route
		console.log('payload %o: ', payload, fileName);
		request.user = payload;
		next();
	} catch (err) {
		throw new UnauthenticatedError('Authentication invalid');
	}
};
