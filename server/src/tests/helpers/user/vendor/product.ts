import application from 'application';
import testProcessRoute from 'tests/helpers/test-process-route';
import { StatusCodes } from 'http-status-codes';
import {
	productData,
	updateProductData,
} from 'tests/accounts/user/vendor-account/product/data';
import path from 'path';
import { ProductSchemaDB } from 'app-schema/product';
import Joi from 'joi';
const filename = path.basename(__filename);

const { CREATED, OK, NOT_FOUND } = StatusCodes;

let checkId = (data: any) => {
	data.should.have.property('product_id');
	data.product_id.should.be.a('string');
};

let validateResult = (data: any) => {
	let productInfo = data;
	productInfo.should.be.an('object');
	Joi.assert(productInfo, ProductSchemaDB);
};

const routeParams = {
	server: application,
	parameter: 'productIds',
	baseUrl: `/api/v1/user/vendor/shop/products`,
	statusCode: OK,
};

const testCreateProduct = testProcessRoute({
	...routeParams,
	verb: 'post',
	statusCode: CREATED,
	dataMatrix: productData,
	checks: checkId,
});

const testGetAllProduct = testProcessRoute({
	...routeParams,
	baseUrl: routeParams.baseUrl + '/all',
	verb: 'get',
	checks: validateResult,
});

const testGetProduct = testProcessRoute({
	...routeParams,
	verb: 'get',
	checks: validateResult,
});

const testUpdateProduct = testProcessRoute({
	...routeParams,
	verb: 'put',
	dataMatrix: updateProductData,
});

const testDeleteProduct = testProcessRoute({
	...routeParams,
	verb: 'delete',
});

const testGetNonExistentProduct = testProcessRoute({
	...routeParams,
	baseUrl: routeParams.baseUrl + '/all',
	verb: 'get',
	statusCode: NOT_FOUND,
});

export {
	testCreateProduct,
	testGetAllProduct,
	testGetProduct,
	testUpdateProduct,
	testDeleteProduct,
	testGetNonExistentProduct,
};
