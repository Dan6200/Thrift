const { Schema, model } = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const UserSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Please provide name'],
		minlength: 3,
		maxlength: 50,
	},
	email: {
		type: String,
		required: [true, 'Please provide email'],
		minlength: 3,
		maxlength: 50,
		match: [ 
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			'Please provide a valid email'
		],
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'Please provide password'],
		minlength: 6,
	},
})

UserSchema.pre('save', async function () {
	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
	return jwt.sign({
		userId: this._id,
		name: this.name,
	},
	process.env.JWT_SECRET,
	{ expiresIn: process.env.JWT_LIFETIME})
}

UserSchema.methods.validatePwd = async function (candidatePwd) {
	const isMatch = await bcrypt.compare(candidatePwd, this.password)
	return isMatch
}

module.exports = model('User', UserSchema)
