import 'express-async-errors';
import application from 'application';
import chai from 'chai';
import chaiHttp from 'chai-http';
import joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import { users } from 'authentication/user-data';
import {
	newShippingData,
	updateShippingData,
} from 'accounts/customer-account/shipping-data';
import { ShippingInfoSchemaDB } from 'app-schema/customer/shipping';

chai.use(chaiHttp).should();

export default async function testShippingInfo() {
	let AddressId: string | null = null;
}

const testCreateShippingInfo = () => {
	describe('/POST shipping info', () => {
		it('it should create a shipping info for the customer', async () => {
			let count = 0;
			const userTokens: string[] = await users.getUserTokens();
			userTokens.should.not.be.empty;
			// console.log(`\nusers: %O\n%s`, userTokens, __filename);
			for (const userToken of userTokens) {
				// console.log(newShippingData[count]);
				const response = await chai
					.request(application)
					.post('/api/v1/user/customer/shipping-info')
					.send(newShippingData[count++])
					.auth(userToken, { type: 'bearer' });
				response.should.have.status(StatusCodes.CREATED);
				response.body.should.have.property('addressId');
				response.body.addressId.should.be.a('string');
				AddressId = response.body.addressId;
			}
		});
	});
};

const testGetAllShippingInfo = (deleted: boolean): void => {
	describe('/GET all shipping info', () => {
		it(`it should ${
			(deleted && 'fail to ') || ''
		}retrieve all the customer shipping accounts`, async () => {
			const userTokens: string[] = await users.getUserTokens();
			userTokens.should.not.be.empty;
			for (const userToken of userTokens) {
				const response = await chai
					.request(application)
					.get(`/api/v1/user/customer/shipping-info/`)
					.auth(userToken, { type: 'bearer' });
				response.should.have.status(StatusCodes.OK);
				response.body.should.be.an('array');
				let shippingInfos = response.body;
				if (deleted) {
					shippingInfos.should.be.empty;
					continue;
				}
				shippingInfos.should.not.be.empty;
				joi.assert(shippingInfos[0], ShippingInfoSchemaDB);
			}
		});
	});
};

const testGetShippingInfo = (deleted: boolean): void => {
	describe('/GET shipping info', () => {
		it(`it should ${
			(deleted && 'fail to ') || ''
		}retrieve the customer shipping account`, async () => {
			const userTokens: string[] = await users.getUserTokens();
			userTokens.should.not.be.empty;
			// console.log(`\nusers: %O\n%s`, userTokens, __filename);
			for (const userToken of userTokens) {
				const response: any = await chai
					.request(application)
					.get(`/api/v1/user/customer/shipping-info/${AddressId}`)
					.auth(userToken, { type: 'bearer' });
				if (deleted) {
					response.should.have.status(StatusCodes.NOT_FOUND);
					continue;
				}
				response.should.have.status(StatusCodes.OK);
				joi.assert(response.body, ShippingInfoSchemaDB);
			}
		});
	});
};

const testUpdateShippingInfo = () => {
	describe('/PUT shipping info', () => {
		it('it should update the shipping info for the user', async () => {
			let count = 0;
			const userTokens: string[] = await users.getUserTokens();
			userTokens.should.not.be.empty;
			// console.log(`\nusers: %O\n%s`, userTokens, __filename);
			for (const userToken of userTokens) {
				const response = await chai
					.request(application)
					.put(`/api/v1/user/customer/shipping-info/${AddressId}`)
					.send(updateShippingData[count++])
					.auth(userToken, { type: 'bearer' });
				response.should.have.status(StatusCodes.OK);
				joi.assert(response.body, ShippingInfoSchemaDB);
			}
		});
	});
};

const testDeleteShippingInfo = () => {
	describe('/DELETE shipping info', () => {
		it('it should delete the shipping info', async () => {
			const userTokens: string[] = await users.getUserTokens();
			userTokens.should.not.be.empty;
			// console.log(`\nusers: %O\n%s`, userTokens, __filename);
			for (const userToken of userTokens) {
				const response = await chai
					.request(application)
					.delete(`/api/v1/user/customer/shipping-info/${AddressId}`)
					.auth(userToken, { type: 'bearer' });
				response.should.have.status(StatusCodes.NO_CONTENT);
			}
		});
	});
};

export {
	testCreateShippingInfo,
	testGetShippingInfo,
	testGetAllShippingInfo,
	testUpdateShippingInfo,
	testDeleteShippingInfo,
};
