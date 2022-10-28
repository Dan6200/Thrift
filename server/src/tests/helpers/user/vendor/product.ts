import application from 'application';
import testProcessRoute from 'tests/helpers/test-process-route';
import { StatusCodes } from 'http-status-codes';
const { CREATED, OK, NOT_FOUND } = StatusCodes;

let outputData: any = {};

const testCreateProduct = testProcessRoute({
	server: application,
	verb: 'post',
	url: '/api/v1/user/vendor/shop/products',
	statusCode: CREATED,
	data: undefined,
	checks: undefined,
	outputData,
});

const { product_id: productId } = outputData;

const testGetAllProduct = testProcessRoute({
	server: application,
	verb: 'get',
	url: `/api/v1/user/vendor/shop/products`,
	statusCode: OK,
});

const testGetProduct = testProcessRoute({
	server: application,
	verb: 'get',
	url: `/api/v1/user/vendor/shop/products/${productId}`,
	statusCode: OK,
});

const testUpdateProduct = testProcessRoute({
	server: application,
	verb: 'put',
	url: `/api/v1/user/vendor/shop/products/${productId}`,
	statusCode: OK,
});

const testDeleteProduct = testProcessRoute({
	server: application,
	verb: 'delete',
	url: `/api/v1/user/vendor/shop/products/${productId}`,
	statusCode: OK,
});

const testGetDeletedProduct = testProcessRoute({
	server: application,
	verb: 'get',
	url: `/api/v1/user/vendor/shop/products/${productId}`,
	statusCode: OK,
});

export {
	testCreateProduct,
	testGetAllProduct,
	testGetProduct,
	testUpdateProduct,
	testDeleteProduct,
	testGetDeletedProduct,
};
