import application from 'application';
import { StatusCodes } from 'http-status-codes';
import {
	newShippingData,
	updateShippingData,
} from 'tests/accounts/customer-account/shipping-data';
import { users } from 'tests/authentication/user-data';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { ShippingInfoSchemaDB } from 'app-schema/customer/shipping';
import joi from 'joi';
chai.use(chaiHttp).should();

const createShipping = async (addressIds: string[]) => {
	let count = 0;
	const userTokens: string[] = await users.getUserTokens();
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		const response = await chai
			.request(application)
			.post('/api/v1/user/customer/shipping-info')
			.send(newShippingData[count++])
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.CREATED);
		response.body.should.have.property('addressId');
		response.body.addressId.should.be.a('string');
		addressIds.push(response.body.addressId);
	}
};

const getShipping = async (addressIds: string[]) => {
	const userTokens: string[] = await users.getUserTokens();
	let count = 0;
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		const response: any = await chai
			.request(application)
			.get(`/api/v1/user/customer/shipping-info/${addressIds[count++]}`)
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.OK);
		joi.assert(response.body, ShippingInfoSchemaDB);
	}
};

const getAllShipping = async () => {
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
};

const updateShipping = async (addressIds: string[]) => {
	let count = 0;
	const userTokens: string[] = await users.getUserTokens();
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		const response = await chai
			.request(application)
			.put(`/api/v1/user/customer/shipping-info/${addressIds[count]}`)
			.send(updateShippingData[count++])
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.OK);
		joi.assert(response.body, ShippingInfoSchemaDB);
	}
};

const deleteShipping = async (addressIds: string[]) => {
	let count = 0;
	const userTokens: string[] = await users.getUserTokens();
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		const response = await chai
			.request(application)
			.delete(
				`/api/v1/user/customer/shipping-info/${addressIds[count++]}`
			)
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.NO_CONTENT);
	}
};

const getDeletedShipping = async (addressIds: string[]) => {
	const userTokens: string[] = await users.getUserTokens();
	let count = 0;
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		const response: any = await chai
			.request(application)
			.get(`/api/v1/user/customer/shipping-info/${addressIds[count++]}`)
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.NOT_FOUND);
		response.body.should.be.empty;
	}
};

const getAllDeletedShipping = async () => {
	const userTokens: string[] = await users.getUserTokens();
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		const response = await chai
			.request(application)
			.get(`/api/v1/user/customer/shipping-info/`)
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.NOT_FOUND);
		response.body.should.be.empty;
	}
};

export {
	createShipping,
	getShipping,
	getAllShipping,
	updateShipping,
	deleteShipping,
	getDeletedShipping,
	getAllDeletedShipping,
};
