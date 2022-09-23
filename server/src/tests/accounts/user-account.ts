import 'express-async-errors';
import application from 'application';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { StatusCodes } from 'http-status-codes';
import {
	newUsers,
	updateUser,
	updateUserPassword,
	users,
} from 'authentication/user-data';
import { UserDataSchemaDB } from 'app-schema/users';
import joi from 'joi';
import db from 'db';

chai.use(chaiHttp).should();

export default function testUserAccount() {
	before(async () => {
		// deletes all entries from user_account
		await db.query('delete from user_account');
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
	describe('/GET user', () => {
		it(`it should retrieve the User account`, async () => {
			const userTokens: string[] = await users.getUserTokens();
			userTokens.should.not.be.empty;
			for (const userToken of userTokens) {
				const response = await chai
					.request(application)
					.get('/api/v1/user')
					.auth(userToken, { type: 'bearer' });
				response.should.have.status(StatusCodes.OK);
				response.body.should.be.an('object');
				joi.assert(response.body, UserDataSchemaDB);
			}
		});
	});
	describe('/PATCH user', () => {
		it('it should update the user info', async () => {
			let n = 0;
			const userTokens: string[] = await users.getUserTokens();
			userTokens.should.not.be.empty;
			for (const userToken of userTokens) {
				const response = await chai
					.request(application)
					.patch('/api/v1/user/info')
					.send(updateUser[n])
					.auth(userToken, { type: 'bearer' });
				response.should.have.status(StatusCodes.OK);
				response.body.should.be.an('object');
				joi.assert(response.body, UserDataSchemaDB);
				n++;
			}
		});
	});
	describe('/PATCH user password', () => {
		it("it should update the user's password", async () => {
			let n = 0;
			const userTokens: string[] = await users.getUserTokens();
			userTokens.should.not.be.empty;
			// console.log(`\nusers: %O\n%s`, userTokens, __filename);
			for (const userToken of userTokens) {
				// console.log(updatedUser[n], __filename);
				const response = await chai
					.request(application)
					.patch('/api/v1/user/password')
					.send(updateUserPassword[n])
					.auth(userToken, { type: 'bearer' });
				response.should.have.status(StatusCodes.NO_CONTENT);
				n++;
			}
		});
	});
	describe('/DELETE user account', () => {
		it("it should delete the user's account", async () => {
			const userTokens: string[] = await users.getUserTokens();
			userTokens.should.not.be.empty;
			for (const userToken of userTokens) {
				const response = await chai
					.request(application)
					.delete('/api/v1/user')
					.auth(userToken, { type: 'bearer' });
				response.should.have.status(StatusCodes.OK);
			}
		});
	});
	describe('/GET user', () => {
		it(`it should fail to retrieve the User account`, async () => {
			const userTokens: string[] = await users.getUserTokens();
			userTokens.should.not.be.empty;
			for (const userToken of userTokens) {
				const response = await chai
					.request(application)
					.get('/api/v1/user')
					.auth(userToken, { type: 'bearer' });
				response.should.have.status(StatusCodes.NOT_FOUND);
			}
		});
	});
}
