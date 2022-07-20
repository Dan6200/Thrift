const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const User = require('../models/user.js')

const register = async (req, res) => {
	const user = await User.create({...req.body})
	const token = user.createJWT()
	res.status(StatusCodes.CREATED).json({
		user:{name: user.name},
		token
	})
}

const login = async (req, res) => {
	const {email, password} = req.body
	if (!email) 
		throw new BadRequestError('Please provide email')
	if (!password) 
		throw new BadRequestError('Please provide password')
	const user = await User.findOne({email})
	if (!user)
		throw new UnauthenticatedError('Invalid Credentials')
	const pwdIsValid = await user.validatePwd(password)
	if (!pwdIsValid)
		throw new UnauthenticatedError('Invalid Credentials')
	const token = user.createJWT()
	res.status(StatusCodes.OK).json({
		user:{name: user.name},
		token
	})
}

module.exports = {
	register,
	login
}
