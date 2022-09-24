import 'express-async-errors';
import application from 'application';
import chai from 'chai';
import chaiHttp from 'chai-http';
import joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import { newUsers, users } from 'authentication/user-data';
import {
	newShippingData,
	updateShippingData,
} from 'accounts/customer-account/shipping-data';
import { ShippingInfoSchemaDB } from 'app-schema/customer/shipping';
import db from 'db';
import { createShipping, registration } from 'tests/helpers';

chai.use(chaiHttp).should();

export default async function testShippingInfo() {
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

	// Testing the shipping route
	let addressIds: Array<string> = [];
	describe('/POST shipping info', () => {
		it(
			'it should create a shipping info for the customer',
			createShipping.bind(null, addressIds)
		);
	});
	describe('/GET shipping info', () => {
		it(`it should retrieve the customer shipping account`, async () => {
			const userTokens: string[] = await users.getUserTokens();
			let count = 0;
			userTokens.should.not.be.empty;
			for (const userToken of userTokens) {
				const response: any = await chai
					.request(application)
					.get(
						`/api/v1/user/customer/shipping-info/${
							addressIds[count++]
						}`
					)
					.auth(userToken, { type: 'bearer' });
				response.should.have.status(StatusCodes.OK);
				joi.assert(response.body, ShippingInfoSchemaDB);
			}
		});
	});
	describe('/GET all shipping info', () => {
		it(`it should retrieve all the customer shipping accounts`, async () => {
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
				shippingInfos.should.not.be.empty;
				joi.assert(shippingInfos[0], ShippingInfoSchemaDB);
			}
		});
	});
	describe('/PUT shipping info', () => {
		it('it should update the shipping info for the user', async () => {
			let count = 0;
			const userTokens: string[] = await users.getUserTokens();
			userTokens.should.not.be.empty;
			for (const userToken of userTokens) {
				const response = await chai
					.request(application)
					.put(
						`/api/v1/user/customer/shipping-info/${addressIds[count]}`
					)
					.send(updateShippingData[count++])
					.auth(userToken, { type: 'bearer' });
				response.should.have.status(StatusCodes.OK);
				joi.assert(response.body, ShippingInfoSchemaDB);
			}
		});
	});
	describe('/DELETE shipping info', () => {
		it('it should delete the shipping info', async () => {
			let count = 0;
			const userTokens: string[] = await users.getUserTokens();
			userTokens.should.not.be.empty;
			for (const userToken of userTokens) {
				const response = await chai
					.request(application)
					.delete(
						`/api/v1/user/customer/shipping-info/${
							addressIds[count++]
						}`
					)
					.auth(userToken, { type: 'bearer' });
				response.should.have.status(StatusCodes.NO_CONTENT);
			}
		});
	});
	describe('/GET shipping info', () => {
		it(`it should fail to retrieve the customer shipping account`, async () => {
			let count = 0;
			const userTokens: string[] = await users.getUserTokens();
			userTokens.should.not.be.empty;
			for (const userToken of userTokens) {
				const response: any = await chai
					.request(application)
					.get(
						`/api/v1/user/customer/shipping-info/${
							addressIds[count++]
						}`
					)
					.auth(userToken, { type: 'bearer' });
				response.should.have.status(StatusCodes.NOT_FOUND);
			}
		});
	});
	describe('/GET all shipping info', () => {
		it(`it should fail to retrieve all the customer shipping accounts`, async () => {
			const userTokens: string[] = await users.getUserTokens();
			userTokens.should.not.be.empty;
			for (const userToken of userTokens) {
				const response = await chai
					.request(application)
					.get(`/api/v1/user/customer/shipping-info/`)
					.auth(userToken, { type: 'bearer' });
				response.should.have.status(StatusCodes.NOT_FOUND);
				let shippingInfos = response.body;
				shippingInfos.should.be.empty;
			}
		});
	});

	// Delete user account
	describe('/DELETE user account', () => {
		it('it should delete the user account', async () => {
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
