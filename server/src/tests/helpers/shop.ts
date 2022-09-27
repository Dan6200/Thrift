import application from 'application';
import { StatusCodes } from 'http-status-codes';
import {
	newShopData,
	updateShopData,
} from 'tests/accounts/vendor-account/shop-data';
import { users } from 'tests/authentication/user-data';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { ShopSchemaDB } from 'app-schema/vendor/shop';
import joi from 'joi';
import log from './log';
chai.use(chaiHttp).should();

//shop_id
//shop_name
//vendor_id
//date_created
//banner_image_path

const createShop = async (shopIds: string[]) => {
	let count = 0;
	const userTokens: string[] = await users.getUserTokens();
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		const response = await chai
			.request(application)
			.post('/api/v1/user/vendor/shop')
			.send(newShopData[count++])
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.CREATED);
		response.body.should.have.property('shop_id');
		response.body.shop_id.should.be.a('string');
		log(userToken, response.body);
		shopIds.push(response.body.shop_id);
	}
};

const getShop = async (shopIds: string[]) => {
	const userTokens: string[] = await users.getUserTokens();
	let count = 0;
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		const response: any = await chai
			.request(application)
			.get(`/api/v1/user/vendor/shop/${shopIds[count++]}`)
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.OK);
		joi.assert(response.body, ShopSchemaDB);
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
	let count = 0;
	const userTokens: string[] = await users.getUserTokens();
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		const response = await chai
			.request(application)
			.put(`/api/v1/user/vendor/shop/${shopIds[count]}`)
			.send(updateShopData[count++])
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.OK);
		joi.assert(response.body, ShopSchemaDB);
	}
};

const deleteShop = async (shopIds: string[]) => {
	let count = 0;
	const userTokens: string[] = await users.getUserTokens();
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		log(shopIds[count]);
		const response = await chai
			.request(application)
			.delete(`/api/v1/user/vendor/shop/${shopIds[count++]}`)
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.NO_CONTENT);
	}
};

const getDeletedShop = async (shopIds: string[]) => {
	const userTokens: string[] = await users.getUserTokens();
	let count = 0;
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		const response: any = await chai
			.request(application)
			.get(`/api/v1/user/vendor/shop/${shopIds[count++]}`)
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.NOT_FOUND);
		response.body.should.be.empty;
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
