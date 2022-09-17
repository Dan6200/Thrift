import 'express-async-errors';
import application from 'application';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { StatusCodes } from 'http-status-codes';
import { updatedUser, users } from 'authentication/user-data';
import path from 'path';
import { UserData } from 'types-and-interfaces';

let fileName = path.basename(__filename);

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
					.get('/api/v1/user-account')
					.auth(userToken, { type: 'bearer' });
				if (deleted) {
					response.should.have.status(StatusCodes.NOT_FOUND);
					continue;
				}
				response.should.have.status(StatusCodes.OK);
				// Runtime type-check
				new UserData(response.body as UserData);
			}
		});
	});
};

const testUpdateUserAccount = () => {
	describe('/PATCH user account', () => {
		it("it should update the user's account", async () => {
			let n = 0;
			const userTokens: string[] = await users.getUserTokens();
			userTokens.should.not.be.empty;
			// console.log(`\nusers: %O\n%s`, userTokens, __filename);
			for (const userToken of userTokens) {
				// console.log(updatedUser[n], __filename);
				const response = await chai
					.request(application)
					.patch('/api/v1/user-account')
					.send(updatedUser[n])
					.auth(userToken, { type: 'bearer' });
				response.should.have.status(StatusCodes.OK);
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
					.delete('/api/v1/user-account')
					.auth(userToken, { type: 'bearer' });
				response.should.have.status(StatusCodes.OK);
			}
		});
	});
};

export { testGetUserAccount, testUpdateUserAccount, testDeleteUserAccount };
