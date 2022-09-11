import 'express-async-errors';
import application from '../../../app';
import chai from 'chai';
import chaiHttp from 'chai-http';
import db from '../../../db';
import { StatusCodes } from 'http-status-codes';
import { updatedUser, users } from '../../authentication/user-data';
import { newShippingData, updateShippingData } from './shipping-data';

chai.use(chaiHttp);
const should = chai.should(),
	expect = chai.expect;

const testCreateShippingInfo = () => {
	describe('/POST shipping info', () => {
		it('it should create a shipping info for the user', async () => {
			const userTokens: string[] = await users.getUserTokens();
			userTokens.should.not.be.empty;
			console.log(`\nusers: %O\n%s`, userTokens, __filename);
			for (const userToken of userTokens) {
				const response = await chai
					.request(application)
					.post('/api/v1/user-account/customer-account/shipping-info')
					.send(newShippingData)
					.auth(userToken, { type: 'bearer' });
				response.should.have.status(StatusCodes.CREATED);
				response.should.have.property('AddressId');
				let AddressId = response.AddressId;
			}
		});
	});
};

const testGetShippingInfo = (deleted: boolean): void => {
	describe('/GET shipping info', () => {
		it(`it should ${
			(deleted && 'fail to ') || ''
		}retrieve the User account`, async () => {
			const userTokens: string[] = await users.getUserTokens();
			userTokens.should.not.be.empty;
			console.log(`\nusers: %O\n%s`, userTokens, __filename);
			for (const userToken of userTokens) {
				const response = await chai
					.request(application)
					.get('/api/v1/user-account/customer-account/shipping-info')
					.auth(userToken, { type: 'bearer' });
				if (deleted) {
					response.should.have.status(StatusCodes.NOT_FOUND);
					continue;
				}
				response.should.have.status(StatusCodes.OK);
			}
		});
	});
};

const testUpdateShippingInfo = () => {
	describe('/PATCH shipping info', () => {
		it('it should update the shipping info for the user', async () => {
			const userTokens: string[] = await users.getUserTokens();
			userTokens.should.not.be.empty;
			console.log(`\nusers: %O\n%s`, userTokens, __filename);
			for (const userToken of userTokens) {
				const response = await chai
					.request(application)
					.post('/api/v1/user-account/customer-account/shipping-info')
					.send(updateShippingData)
					.auth(userToken, { type: 'bearer' });
				response.should.have.status(StatusCodes.OK);
			}
		});
	});
};

const testDeleteShippingInfo = () => {
	describe('/DELETE shipping info', () => {
		it('it should delete the shipping info', async () => {
			try {
				const userTokens: string[] = await users.getUserTokens();
				userTokens.should.not.be.empty;
				console.log(`\nusers: %O\n%s`, userTokens, __filename);
				for (const userToken of userTokens) {
					console.log(`\nUser ID: ${ID}, Data: %o`, userToken);
					const response = await chai
						.request(application)
						.delete(
							'/api/v1/user-account/customer-account/shipping-info'
						)
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
	testCreateShippingInfo,
	testGetShippingInfo,
	testUpdateShippingInfo,
	testDeleteShippingInfo,
};
