import application from '../../app';
import chai from 'chai';
import chaiHttp from 'chai-http';
import db from '../../db';
import { newUsers, loginUsers, users } from './user-data';
import { StatusCodes } from 'http-status-codes';

const should = chai.should();

chai.use(chaiHttp);

const testRegistration = () => {
	beforeEach(async () => {
		await db.query('delete from user_account');
		await users.clear();
	});
	// Testing the register route
	describe('/POST user: Registration', () => {
		it(`it should register ${newUsers.length} new users`, async () => {
			for (let i = 0; i < newUsers.length; i++) {
				console.log(`\nUser ${i + 1}: %o`, newUsers[i], __filename);
				const response = await chai
					.request(application)
					.post('/api/v1/auth/register')
					.send(newUsers[i]);
				response.should.have.status(StatusCodes.CREATED);
				response.body.should.be.an('object');
				const responseObject = response.body;
				console.log(`\nresponse %o`, responseObject, __filename);
				responseObject.should.have.property('token');
				const { token } = responseObject;
				await users.push(token);
			}
			console.log(users, __filename);
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
			console.log('user tokens cleared before login', __filename);
		});
		const noOfUsers = loginUsers[n].length;
		it(`it should login ${noOfUsers} users`, async () => {
			for (let i = 0; i < noOfUsers; i++) {
				console.log(
					`\nUser ${i + 1}: %o`,
					loginUsers[n][i],
					__filename
				);
				const response = await chai
					.request(application)
					.post('/api/v1/auth/login')
					.send(loginUsers[n][i]);
				response.should.have.status(StatusCodes.OK);
				response.body.should.be.an('object');
				const responseObject = response.body;
				console.log(`\nresponse %o`, responseObject, __filename);
				responseObject.should.have.property('token');
				const { token } = responseObject;
				await users.push(token);
			}
		});
	});
};

export { testRegistration, testLogin };
