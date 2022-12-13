import application from 'application';
import { StatusCodes } from 'http-status-codes';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { ShippingInfoSchemaDB } from 'app-schema/customer/shipping';
import joi from 'joi';
import {
	newShippingData,
	updateShippingData,
} from 'tests/accounts/user/customer-account/shipping-data';
chai.use(chaiHttp).should();

const createShipping = async (addressIds: string[]) => {
	let count = 0;
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		const response = await chai
			.request(application)
			.post('/api/v1/user/customer/shipping-info')
			.send(newShippingData[count++])
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.CREATED);
		response.body.should.have.property('address_id');
		response.body.address_id.should.be.a('string');
		addressIds.push(response.body.address_id);
	}
};

const getShipping = async (addressIds: string[]) => {
	let count = 0;
	userTokens.should.not.be.empty;
	let lastAddressId = '';
	for (const userToken of userTokens) {
		let addressId = addressIds[count];
		addressId.should.not.equal(lastAddressId);
		const response: any = await chai
			.request(application)
			.get(`/api/v1/user/customer/shipping-info/${addressId}`)
			.auth(userToken, { type: 'bearer' });
		lastAddressId = addressId;
		count++;
		response.should.have.status(StatusCodes.OK);
		joi.assert(response.body, ShippingInfoSchemaDB);
	}
};

const getAllShipping = async () => {
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
	userTokens.should.not.be.empty;
	let lastAddressId = '';
	for (const userToken of userTokens) {
		let addressId = addressIds[count];
		addressId.should.not.equal(lastAddressId);
		const response = await chai
			.request(application)
			.put(`/api/v1/user/customer/shipping-info/${addressId}`)
			.send(updateShippingData[count])
			.auth(userToken, { type: 'bearer' });
		lastAddressId = addressId;
		count++;
		response.should.have.status(StatusCodes.OK);
		joi.assert(response.body, ShippingInfoSchemaDB);
	}
};

const deleteShipping = async (addressIds: string[]) => {
	let count = 0;
	userTokens.should.not.be.empty;
	let lastAddressId = '';
	for (const userToken of userTokens) {
		let addressId = addressIds[count];
		addressId.should.not.equal(lastAddressId);
		const response = await chai
			.request(application)
			.delete(`/api/v1/user/customer/shipping-info/${addressId}`)
			.auth(userToken, { type: 'bearer' });
		lastAddressId = addressId;
		count++;
		response.should.have.status(StatusCodes.NO_CONTENT);
	}
};

const getDeletedShipping = async (addressIds: string[]) => {
	let count = 0;
	userTokens.should.not.be.empty;
	let lastAddressId = '';
	for (const userToken of userTokens) {
		let addressId = addressIds[count];
		addressId.should.not.equal(lastAddressId);
		const response: any = await chai
			.request(application)
			.get(`/api/v1/user/customer/shipping-info/${addressId}`)
			.auth(userToken, { type: 'bearer' });
		lastAddressId = addressId;
		count++;
		response.should.have.status(StatusCodes.NOT_FOUND);
		response.body.should.be.empty;
	}
};

const getAllDeletedShipping = async () => {
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
