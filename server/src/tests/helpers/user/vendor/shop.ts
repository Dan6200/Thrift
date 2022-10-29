import application from 'application';
import { StatusCodes } from 'http-status-codes';
import { users } from 'tests/authentication/user-data';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { ShopSchemaDB } from 'app-schema/vendor/shop';
import joi from 'joi';
import {
	newShopData,
	updateShopData,
} from 'tests/accounts/user/vendor-account/shop/data';
chai.use(chaiHttp).should();

const createShop = async (shopIds: string[]) => {
	let count = 0;
	const userTokens: string[] = await users.getUserTokens();
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		const response = await chai
			.request(application)
			.post('/api/v1/user/vendor/shop')
			.send(newShopData[count])
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.CREATED);
		response.body.should.have.property('shop_id');
		response.body.shop_id.should.be.a('string');
		shopIds.push(response.body.shop_id);
		count++;
	}
};

const getShop = async (shopIds: string[]) => {
	const userTokens: string[] = await users.getUserTokens();
	let count = 0,
		lastShopId = '';
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		let shopId = shopIds[count];
		shopId.should.not.be.equal(lastShopId);
		const response: any = await chai
			.request(application)
			.get(`/api/v1/user/vendor/shop/${shopId}`)
			.auth(userToken, { type: 'bearer' });
		lastShopId = shopId;
		response.should.have.status(StatusCodes.OK);
		joi.assert(response.body, ShopSchemaDB);
		count++;
	}
};

const getAllShop = async () => {
	const userTokens: string[] = await users.getUserTokens();
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		const response = await chai
			.request(application)
			.get(`/api/v1/user/vendor/shop/`)
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.OK);
		response.body.should.be.an('array');
		let shopInfos = response.body;
		shopInfos.should.not.be.empty;
		joi.assert(shopInfos[0], ShopSchemaDB);
	}
};

const updateShop = async (shopIds: string[]) => {
	let count = 0,
		lastShopId = '';
	const userTokens: string[] = await users.getUserTokens();
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		let shopId = shopIds[count];
		shopId.should.not.be.equal(lastShopId);
		const response = await chai
			.request(application)
			.put(`/api/v1/user/vendor/shop/${shopId}`)
			.send(updateShopData[count])
			.auth(userToken, { type: 'bearer' });
		lastShopId = shopId;
		response.should.have.status(StatusCodes.OK);
		joi.assert(response.body, ShopSchemaDB);
		count++;
	}
};

const deleteShop = async (shopIds: string[]) => {
	let count = 0,
		lastShopId = '';
	const userTokens: string[] = await users.getUserTokens();
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		let shopId = shopIds[count];
		shopId.should.not.be.equal(lastShopId);
		const response = await chai
			.request(application)
			.delete(`/api/v1/user/vendor/shop/${shopId}`)
			.auth(userToken, { type: 'bearer' });
		lastShopId = shopId;
		response.should.have.status(StatusCodes.NO_CONTENT);
		count++;
	}
};

const getDeletedShop = async (shopIds: string[]) => {
	const userTokens: string[] = await users.getUserTokens();
	let count = 0,
		lastShopId = '';
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		let shopId = shopIds[count];
		shopId.should.not.be.equal(lastShopId);
		const response: any = await chai
			.request(application)
			.get(`/api/v1/user/vendor/shop/${shopId}`)
			.auth(userToken, { type: 'bearer' });
		lastShopId = shopId;
		response.should.have.status(StatusCodes.NOT_FOUND);
		response.body.should.be.empty;
		count++;
	}
};

const getAllDeletedShop = async () => {
	const userTokens: string[] = await users.getUserTokens();
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		const response = await chai
			.request(application)
			.get(`/api/v1/user/vendor/shop/`)
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.NOT_FOUND);
		response.body.should.be.empty;
	}
};

export {
	createShop,
	getShop,
	getAllShop,
	updateShop,
	deleteShop,
	getDeletedShop,
	getAllDeletedShop,
};
