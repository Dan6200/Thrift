const jwt = require ('jsonwebtoken')

const createJWT = function ({ user_id: userId, phone, email }) {
	return jwt.sign (
		{
			userId,
			phone,
			email
		},
		process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_LIFETIME }
	)
}

module.exports = createJWT
