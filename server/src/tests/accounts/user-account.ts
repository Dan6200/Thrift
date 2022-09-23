import 'express-async-errors';
import application from 'application';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { StatusCodes } from 'http-status-codes';
import { newUsers, updateUserPassword, users } from 'authentication/user-data';
import db from 'db';
import { getUser, patchUser, registration } from 'tests/helpers';

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
		it(`it should register ${newUsers.length} new users`, registration);
	});
	describe('/GET user', () => {
		it(`it should retrieve the User account`, getUser);
	});
	describe('/PATCH user', () => {
		it('it should update the user info', patchUser);
	});
	describe('/PATCH user password', () => {
		it("it should update the user's password", patchUserPassword);
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
