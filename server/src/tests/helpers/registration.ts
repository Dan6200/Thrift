import chai from 'chai';
import chaiHttp from 'chai-http';
import application from 'application';
import { StatusCodes } from 'http-status-codes';
import { newUsers, users } from 'tests/authentication/user-data';

chai.use(chaiHttp).should();
export default async function registration() {
	let lastUser: Object = {},
		lastToken: string = '';
	for (let i = 0; i < newUsers.length; i++) {
		const newUser = newUsers[i];
		newUser.should.not.be.equal(lastUser);
		const response = await chai
			.request(application)
			.post('/api/v1/auth/register')
			.send(newUser);
		response.should.have.status(StatusCodes.CREATED);
		response.body.should.be.an('object');
		const responseObject = response.body;
		responseObject.should.have.property('token');
		const { token } = responseObject;
		token.should.not.be.equal(lastToken);
		await users.push(token);
		lastUser = newUser;
		lastToken = token;
	}
}
