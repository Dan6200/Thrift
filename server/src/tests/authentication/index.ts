import application from 'application';
import chai from 'chai';
import chaiHttp from 'chai-http';
import db from 'db';
import { newUsers, loginUsers, users } from 'authentication/user-data';
import { StatusCodes } from 'http-status-codes';
chai.use(chaiHttp).should();

export default async function (): Promise<void> {
	before(async () => {
		// deletes all entries from user_account
		await db.query('delete from user_account');
	});
	beforeEach(async () => {
		// clears the user token array
		await users.clear();
	});
	// Testing the register route
	describe('/POST user: Registration', () => {
		it(`it should register ${newUsers.length} new users`, async () => {
			for (let i = 0; i < newUsers.length; i++) {
				const response = await chai
					.request(application)
					.post('/api/v1/auth/register')
					.send(newUsers[i]);
				response.should.have.status(StatusCodes.CREATED);
				response.body.should.be.an('object');
				const responseObject = response.body;
				responseObject.should.have.property('token');
				const { token } = responseObject;
				await users.push(token);
			}
		});
	});
	// Testing the login route
	describe('/POST user: Login', () => {
		const noOfUsers = loginUsers.length;
		it(`it should login ${noOfUsers} users`, async () => {
			for (let i = 0; i < noOfUsers; i++) {
				const response = await chai
					.request(application)
					.post('/api/v1/auth/login')
					.send(loginUsers[i]);
				response.should.have.status(StatusCodes.CREATED);
				response.body.should.be.an('object');
				const responseObject = response.body;
				responseObject.should.have.property('token');
				const { token } = responseObject;
				await users.push(token);
			}
		});
	});
}
