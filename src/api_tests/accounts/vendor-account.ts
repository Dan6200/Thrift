import 'express-async-errors';
import application from '../../app';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { StatusCodes } from 'http-status-codes';
import { updatedUser, users } from '../authentication/test-data';
import path from 'path';

let fileName = path.basename(__filename);

chai.use(chaiHttp);
const should = chai.should(),
	expect = chai.expect;

const testCreateVendorAccount = () => {
	describe('/POST vendor account', () => {
		it('it should create a vendor account for the user', async () => {
			try {
				const userIds: Array<string> = await users.getUserIDs();
				userIds.should.not.be.empty;
				console.log(`\nusers: %O`, userIds, fileName);
				for (const ID of userIds) {
					const userToken: string = await users.getUserToken(ID);
					console.log(`\nUser ID: ${ID}, Data %o`, userToken);
					const response = await chai
						.request(application)
						.post('/api/v1/user-account/vendor')
						.send({ ID })
						.auth(userToken, { type: 'bearer' });
					response.should.have.status(StatusCodes.CREATED);
				}
			} catch (error) {
				console.error(error);
				throw error;
			}
		});
	});
};

const testGetVendorAccount = (deleted: boolean) => {
	describe('/GET vendor account', () => {
		it(`it should ${
			(deleted && 'fail to ') || ''
		}retrieve the User account`, async () => {
			try {
				const userIds: Array<string> = await users.getUserIDs();
				userIds.should.not.be.empty;
				console.log(`\nusers: %O`, userIds);
				for (const ID of userIds) {
					const userToken: string = await users.getUserToken(ID);
					console.log(`\nUser ID: ${ID}, Data %o`, userToken);
					const response = await chai
						.request(application)
						.get('/api/v1/user-account/vendor')
						.auth(userToken, { type: 'bearer' });
					if (deleted) {
						response.should.have.status(StatusCodes.NOT_FOUND);
						continue;
					}
					response.should.have.status(StatusCodes.OK);
				}
			} catch (error) {
				console.error(error);
				throw error;
			}
		});
	});
};

const testUpdateVendorAccount = () => {};

const testDeleteVendorAccount = () => {
	describe('/DELETE vendor account', () => {
		it('it should delete the vendor account', async () => {
			try {
				const userIds: string[] = await users.getUserIDs();
				userIds.should.not.be.empty;
				console.log(`\nusers: %O`, userIds);
				for (const ID of userIds) {
					const userToken: string = await users.getUserToken(ID);
					console.log(`\nUser ID: ${ID}, Data %o`, userToken);
					const response = await chai
						.request(application)
						.delete('/api/v1/user-account/vendor')
						.auth(userToken, { type: 'bearer' });
					response.should.have.status(StatusCodes.OK);
				}
			} catch (error) {
				console.error(error);
				throw error;
			}
		});
	});
};

export {
	testGetVendorAccount,
	testUpdateVendorAccount,
	testCreateVendorAccount,
	testDeleteVendorAccount,
};
