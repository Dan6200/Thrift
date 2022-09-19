import 'express-async-errors';
import application from 'application';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { StatusCodes } from 'http-status-codes';
import {
	updateUser,
	updateUserPassword,
	users,
} from 'authentication/user-data';
import { UserDataSchemaDB } from 'app-schema/users';
import joi from 'joi';

chai.use(chaiHttp);
const should = chai.should(),
	expect = chai.expect;

const testGetUserAccount = (deleted: boolean) => {
	describe('/GET user account', () => {
		// Prints it should retrieve the User account if the user exists
		// Prints it should fail to retrieve the User account if the user doesn't exist
		it(`it should ${
			(deleted && 'fail to ') || ''
		}retrieve the User account`, async () => {
			const userTokens: string[] = await users.getUserTokens();
			deleted || userTokens.should.not.be.empty;
			// console.log(`\nusers: %O\n%s`, userTokens, __filename);
			for (const userToken of userTokens) {
				const response = await chai
					.request(application)
					.get('/api/v1/user')
					.auth(userToken, { type: 'bearer' });
				if (deleted) {
					response.should.have.status(StatusCodes.NOT_FOUND);
					continue;
				}
				response.should.have.status(StatusCodes.OK);
				response.body.should.be.an('object');
				joi.assert(response.body, UserDataSchemaDB);
			}
		});
	});
};

const testUpdateUserAccount = () => {
	describe('/PATCH user account', () => {
		it('it should update the user info', async () => {
			let n = 0;
			const userTokens: string[] = await users.getUserTokens();
			userTokens.should.not.be.empty;
			// console.log(`\nusers: %O\n%s`, userTokens, __filename);
			for (const userToken of userTokens) {
				// console.log(updatedUser[n], __filename);
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
};

const testUpdateUserPassword = () => {
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
};

const testDeleteUserAccount = () => {
	describe('/DELETE user account', () => {
		it("it should delete the user's account", async () => {
			const userTokens: string[] = await users.getUserTokens();
			userTokens.should.not.be.empty;
			// console.log(`\nusers: %O\n%s`, userTokens, __filename);
			for (const userToken of userTokens) {
				const response = await chai
					.request(application)
					.delete('/api/v1/user')
					.auth(userToken, { type: 'bearer' });
				response.should.have.status(StatusCodes.OK);
			}
		});
	});
};

export {
	testGetUserAccount,
	testUpdateUserAccount,
	testUpdateUserPassword,
	testDeleteUserAccount,
};
