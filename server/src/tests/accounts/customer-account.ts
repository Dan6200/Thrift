import 'express-async-errors';
import application from '../../app';
import chai from 'chai';
import chaiHttp from 'chai-http';
import db from '../../db';
import { StatusCodes } from 'http-status-codes';
import { updatedUser, users } from '../authentication/test-data';
import { NotFoundError } from '../../errors';
import path from 'path';

let fileName = path.basename(__filename);

chai.use(chaiHttp);
const should = chai.should(),
	expect = chai.expect;

const testCreateCustomerAccount = () => {
	describe('/POST customer account', () => {
		it('it should create a customer account for the user', async () => {
			try {
				const userIds = await users.getUserIDs();
				userIds.should.not.be.empty;
				console.log(`\nusers: %O`, userIds, fileName);
				for (const ID of userIds) {
					const userToken: string = await users.getUserToken(ID);
					console.log(`\nUser ID: ${ID}, Data: %o`, userToken);
					const response = await chai
						.request(application)
						.post('/api/v1/user-account/customer')
						.send({ ID })
						.auth(userToken, { type: 'bearer' });
					response.should.have.status(StatusCodes.CREATED);
					response.body.should.be.a('CustomerId');
					const responseData = response.body;
					console.log(`response %o`, responseData);
					responseData.should.have.property('customerId');
					const { customerId } = responseData;
					customerId.should.equal(ID);
				}
			} catch (error) {
				console.error(error);
				throw error;
			}
		});
	});
};

const testGetCustomerAccount = (deleted: boolean): void => {
	describe('/GET customer account', () => {
		it(`it should ${
			(deleted && 'fail to ') || ''
		}retrieve the User account`, async () => {
			try {
				const userIds: string[] = await users.getUserIDs();
				userIds.should.not.be.empty;
				console.log(`\nusers: %O`, userIds);
				for (const ID of userIds) {
					const userToken = await users.getUserToken(ID);
					console.log(`\nUser ID: ${ID}, Data: %o`, userToken);
					const response = await chai
						.request(application)
						.get('/api/v1/user-account/customer')
						.auth(userToken, { type: 'bearer' });
					if (deleted) {
						response.should.have.status(StatusCodes.NOT_FOUND);
						continue;
					}
					response.should.have.status(StatusCodes.OK);
					response.body.should.be.an('object');
					const responseData = response.body;
					console.log(`response %o`, responseData);
					responseData.should.have.property('customerId');
					const { customerId } = responseData;
					customerId.should.equal(ID);
				}
			} catch (error) {
				console.error(error);
				throw error;
			}
		});
	});
};

const testUpdateCustomerAccount = () => {};

const testDeleteCustomerAccount = () => {
	describe('/DELETE customer account', () => {
		it('it should delete the customer account', async () => {
			try {
				const userIds = await users.getUserIDs();
				userIds.should.not.be.empty;
				console.log(`\nusers: %O`, userIds);
				for (const ID of userIds) {
					const userToken = await users.getUserToken(ID);
					console.log(`\nUser ID: ${ID}, Data: %o`, userToken);
					const response = await chai
						.request(application)
						.delete('/api/v1/user-account/customer')
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
	testCreateCustomerAccount,
	testGetCustomerAccount,
	testUpdateCustomerAccount,
	testDeleteCustomerAccount,
};
