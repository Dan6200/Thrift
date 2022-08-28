import jwt from 'jsonwebtoken';

export const createToken = function (userId: string): string {
	return jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_LIFETIME,
	});
};
