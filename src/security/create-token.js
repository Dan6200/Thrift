const jwt = require ('jsonwebtoken')

const createJWT = function ({user_id: userId, first_name: fName, initials}) {
	return jwt.sign (
		{ userId, fName, initials, },
		process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_LIFETIME }
	)
}

module.exports = createJWT
