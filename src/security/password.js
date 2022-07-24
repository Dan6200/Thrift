const bcrypt = require('bcryptjs')

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10)
	password = await bcrypt.hash(password, salt)
	return	password
}

loginValidatePassword = async function (candidatePwd, storedPassword) {
	const isMatch = await bcrypt.compare(candidatePwd, storedPassword)
	return isMatch
}

module.exports = {
	hashPassword,
	loginValidatePassword
}
