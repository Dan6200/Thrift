import application from 'application';
import testProcessRoute from 'tests/helpers/test-process-route';
import { StatusCodes } from 'http-status-codes';
const { CREATED, OK, NOT_FOUND } = StatusCodes;

const testCreateProduct = testProcessRoute({
	server: application,
	verb: 'post',
	url: '/api/v1/user/vendor/shop/products',
	statusCode: CREATED,
});

const testGetAllProducts = testProcessRoute({
	server: application,
	verb: 'get',
	url: '/api/v1/user/vendor/shop/products',
	statusCode: OK,
});

export { testCreateProduct, testGetAllProducts };
