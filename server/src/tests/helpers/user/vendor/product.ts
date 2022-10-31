import application from 'application';
import testProcessRoute from 'tests/helpers/test-process-route';
import { StatusCodes } from 'http-status-codes';
import {
	productData,
	updateProductData,
} from 'tests/accounts/user/vendor-account/product/data';
import path from 'path';
const filename = path.basename(__filename);

const { CREATED, OK, NOT_FOUND } = StatusCodes;

let checkId = (data: any) => {
		data.should.have.property('product_id');
		data.product_id.should.be.a('string');
	},
	setIdParam = (IdParam: string[], data: any) => {
		console.log(data.product_id, 'at ' + filename);
		data.product_id && IdParam.push(data.product_id);
	};

const routeParams = {
	server: application,
	url: `/api/v1/user/vendor/shop/products`,
	statusCode: OK,
};

const testCreateProduct = testProcessRoute({
	...routeParams,
	verb: 'post',
	statusCode: CREATED,
	dataList: productData,
	checks: checkId,
	setParams: setIdParam,
});

const testGetAllProduct = testProcessRoute({
	...routeParams,
	verb: 'get',
});

const testGetProduct = testProcessRoute({
	...routeParams,
	verb: 'get',
	statusCode: OK,
});

const testUpdateProduct = testProcessRoute({
	...routeParams,
	verb: 'put',
	dataList: updateProductData,
});

const testDeleteProduct = testProcessRoute({
	...routeParams,
	verb: 'delete',
});

const testGetDeletedProduct = testProcessRoute({
	...routeParams,
	verb: 'get',
	statusCode: NOT_FOUND,
});

export {
	testCreateProduct,
	testGetAllProduct,
	testGetProduct,
	testUpdateProduct,
	testDeleteProduct,
	testGetDeletedProduct,
};
