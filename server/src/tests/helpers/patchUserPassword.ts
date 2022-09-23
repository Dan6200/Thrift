import { application } from 'express';
import { StatusCodes } from 'http-status-codes';
import { updateUserPassword, users } from 'tests/authentication/user-data';

export default async function patchUserPassword() {
	let n = 0;
	const userTokens: string[] = await users.getUserTokens();
	userTokens.should.not.be.empty;
	// console.log(`\nusers: %O\n%s`, userTokens, __filename);
	let lastPassword = null,
		lastToken = '';
	for (const userToken of userTokens) {
		// console.log(updatedUser[n], __filename);
		let password = updateUserPassword[n++];
		const response = await chai
			.request(application)
			.patch('/api/v1/user/password')
			.send(password)
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.NO_CONTENT);
	}
}
