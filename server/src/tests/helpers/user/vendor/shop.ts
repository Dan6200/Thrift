import { StatusCodes } from 'http-status-codes';
import path from 'path';
import Joi from 'joi';
import app from '../../../../app';
import { ShopSchemaDB } from '../../../../app-schema/vendor/shop';
import {
	newShopData,
	updateShopData,
} from '../../../accounts/user/vendor-account/shop/data';
import testProcessRoute from '../../test-process-route';
const filename = path.basename(__filename);

const { CREATED, OK, NOT_FOUND, NO_CONTENT } = StatusCodes;

let checkId = (data: any) => {
	data.should.have.property('shop_id');
	data.shop_id.should.be.a('string');
};

let validateResultList = (data: any) => {
	let shopInfoList = data;
	shopInfoList.should.be.an('array');
	for (let shopInfo of shopInfoList) Joi.assert(shopInfo, ShopSchemaDB);
};

let validateResult = (data: any) => {
	let shopInfo = data;
	shopInfo.should.be.an('object');
	Joi.assert(shopInfo, ShopSchemaDB);
};

const routeParams = {
	server: app,
	parameter: 'shopIds',
	baseUrl: `/api/v1/user/vendor/shop`,
	statusCode: OK,
};

const testCreateShop = testProcessRoute({
	...routeParams,
	verb: 'post',
	statusCode: CREATED,
	dataMatrix: newShopData,
	checks: checkId,
});

const testGetAllShop = testProcessRoute({
	...routeParams,
	verb: 'get',
	checks: validateResultList,
});

const testGetShop = testProcessRoute({
	...routeParams,
	verb: 'get',
	checks: validateResult,
});

const testUpdateShop = testProcessRoute({
	...routeParams,
	verb: 'put',
	dataMatrix: updateShopData,
});

const testDeleteShop = testProcessRoute({
	...routeParams,
	verb: 'delete',
	statusCode: NO_CONTENT,
});

const testGetNonExistentShop = testProcessRoute({
	...routeParams,
	verb: 'get',
	statusCode: NOT_FOUND,
});

export {
	testCreateShop,
	testGetAllShop,
	testGetShop,
	testUpdateShop,
	testDeleteShop,
	testGetNonExistentShop,
};
