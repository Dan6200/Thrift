const jwt = require ('jsonwebtoken')

const createJWT = function (userId) {
	return jwt.sign (
		{ userId },
		process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_LIFETIME }
	)
}

module.exports = createJWT
