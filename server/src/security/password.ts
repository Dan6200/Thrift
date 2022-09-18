import bcrypt from 'bcryptjs';

const hashPassword = async (password: string): Promise<string> => {
	const salt: string = await bcrypt.genSalt(10);
	const encPassword: string = await bcrypt.hash(password, salt);
	return encPassword;
};

const validatePassword = async function (
	candidatePassword: string,
	storedPassword: string
): Promise<boolean> {
	const isMatch = await bcrypt.compare(candidatePassword, storedPassword);
	return isMatch;
};

export { hashPassword, validatePassword };
