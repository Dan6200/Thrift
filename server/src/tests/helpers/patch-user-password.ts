import application from 'application';
import { StatusCodes } from 'http-status-codes';
import { updateUserPassword, users } from 'tests/authentication/user-data';
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp).should();
export default async function patchUserPassword() {
	let n = 0;
	const userTokens: string[] = await users.getUserTokens();
	userTokens.should.not.be.empty;
	// console.log(`\nusers: %O\n%s`, userTokens, __filename);
	let lastPassword = {},
		lastToken = '';
	for (const userToken of userTokens) {
		// console.log(updatedUser[n], __filename);
		userToken.should.not.equal(lastToken);
		let password = updateUserPassword[n++];
		password.should.not.deep.equal(lastPassword);
		const response = await chai
			.request(application)
			.patch('/api/v1/user/password')
			.send(password)
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.NO_CONTENT);
		lastToken = userToken;
		lastPassword = password;
	}
}
