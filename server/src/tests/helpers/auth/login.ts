import chai from 'chai';
import chaiHttp from 'chai-http';
import application from 'application';
import { StatusCodes } from 'http-status-codes';
import { loginUsers, users } from 'tests/authentication/user-data';

chai.use(chaiHttp).should();
export default async function login() {
	let lastUser: Object = {},
		noOfUsers = loginUsers.length;
	for (let i = 0; i < noOfUsers; i++) {
		let user = loginUsers[i];
		user.should.not.be.equal(lastUser);
		const response = await chai
			.request(application)
			.post('/api/v1/auth/login')
			.send(user);
		response.should.have.status(StatusCodes.CREATED);
		response.body.should.be.an('object');
		const responseObject = response.body;
		responseObject.should.have.property('token');
		const { token } = responseObject;
		await users.push(token);
		lastUser = user;
	}
}