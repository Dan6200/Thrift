import jwt, { Secret } from 'jsonwebtoken'

export const createToken = function (
	userId: string,
	callback: (token: string) => void
): void {
	jwt.sign(
		{ userId },
		process.env.JWT_SECRET as Secret,
		{
			expiresIn: process.env.JWT_LIFETIME,
		},
		(err, _token) => {
			if (err) throw err
			callback(_token as string)
		}
	)
}
