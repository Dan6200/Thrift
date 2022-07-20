const jwt = require('jsonwebtoken')
const User = require('../models/user.js')
const { UnauthenticatedError } = require('../errors') 

module.exports = async (req, res, next) => {
	// check header
	const authHeader = req.headers.authorization
	if (!authHeader || !authHeader.startsWith('Bearer '))
		throw new UnauthenticatedError('Authentication invalid')
	const token = authHeader.split(' ')[1]
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET)
		// attach the user to the Job route
		const { userId, name } = payload
		req.user = { userId, name }
		// alternate syntax
		// ...useful if users can be deleted from collection
		// const user = await User.findById(userId).select('-password') -- Omit password when returning query
		// req.user = user
		next()
	} catch (err) {
		throw new UnauthenticatedError('Authentication invalid')
	}
}
