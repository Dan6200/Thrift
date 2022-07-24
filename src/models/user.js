const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

/*
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
*/
