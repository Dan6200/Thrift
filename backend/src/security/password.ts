import bcrypt from 'bcryptjs';

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10)
	password = await bcrypt.hash(password, salt)
	return	password
}

const validatePassword = async function (candidatePassword, storedPassword) {
	const isMatch = await bcrypt.compare(
		candidatePassword, storedPassword
	)
	return isMatch
}

export {
	hashPassword,
	validatePassword
};
