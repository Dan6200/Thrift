import application from 'application';
import testProcessRoute from 'tests/helpers/test-process-route';
import { StatusCodes } from 'http-status-codes';
import {
	newShopData,
	updateShopData,
} from 'tests/accounts/user/vendor-account/shop/data';
import path from 'path';
import { ShopSchemaDB } from 'app-schema/vendor/shop';
import Joi from 'joi';
const filename = path.basename(__filename);

const { CREATED, OK, NOT_FOUND } = StatusCodes;

let checkId = (data: any) => {
	data.should.have.property('shop_id');
	data.shop_id.should.be.a('string');
};

let validateResult = (data: any) => {
	let shopInfo = data;
	shopInfo.should.be.an('object');
	Joi.assert(shopInfo, ShopSchemaDB);
};

const routeParams = {
	server: application,
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
	baseUrl: routeParams.baseUrl + '/all',
	verb: 'get',
	checks: validateResult,
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
