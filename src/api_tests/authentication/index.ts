import 'express-async-errors';
import application from '../../app';
import chai from 'chai';
import chaiHttp from 'chai-http';
import db from '../../db';
import { newUsers, loginUsers, users } from './test-data';
import { StatusCodes } from 'http-status-codes';
const should = chai.should();

chai.use(chaiHttp);

const testRegistration = () => {
	beforeEach(async () => {
		await db.query('delete from marketplace.user_account');
		await users.clear();
	});
	// Testing the register route
	describe('/POST user: Registration', () => {
		it(`it should register ${newUsers.length} new users`, async () => {
			for (let i = 0; i < newUsers.length; i++) {
				console.log(`\nUser ${i + 1}: %o`, newUsers[i]);
				const response = await chai
					.request(application)
					.post('/api/v1/auth/register')
					.send(newUsers[i]);
				response.should.have.status(StatusCodes.CREATED);
				response.body.should.be.an('object');
				const responseObject = response.body;
				console.log(`\nresponse %o`, responseObject);
				responseObject.should.have.property('newUser');
				responseObject.should.have.property('token');
				const { newUser, token } = responseObject;
				newUser.should.have.property('user_id');
				newUser.should.have.property('phone');
				newUser.should.have.property('email');
				const { user_id } = newUser;
				await users.addUser(user_id, token);
			}
			console.log(users);
		});
	});
};

const testLogin = (count: number) => {
	// Testing the login route
	describe('/POST user: Login', () => {
		const n = count - 1;
		beforeEach(() => {
			// clear the saved user tokens before registration
			// user = {}
			console.log('user tokens cleared');
		});
		const noOfUsers = loginUsers[n].length;
		it(`it should login ${noOfUsers} users`, async () => {
			for (let i = 0; i < noOfUsers; i++) {
				console.log(`\nUser ${i + 1}: %o`, loginUsers[n][i]);
				const response = await chai
					.request(application)
					.post('/api/v1/auth/login')
					.send(loginUsers[n][i]);
				response.should.have.status(StatusCodes.OK);
				response.body.should.be.an('object');
				const responseObject = response.body;
				console.log(`\nresponse %o`, responseObject);
				responseObject.should.have.property('userId');
				responseObject.should.have.property('token');
				const { userId, token } = responseObject;
				await users.addUser(userId, token);
			}
		});
	});
};

export { testRegistration, testLogin, users };
