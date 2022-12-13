import application from 'application';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { StatusCodes } from 'http-status-codes';
import * as testProcessRoute from 'tests/helpers/test-process-route';
// import path from 'path';
chai.use(chaiHttp).should();

const routeParams = {
	server: application,
	baseUrl: '/api/v1/user/customer',
};

const testCreateCustomer = testProcessRoute.singleData({
	...routeParams,
	verb: 'post',
	statusCode: StatusCodes.CREATED,
});

const testGetCustomer = testProcessRoute.singleData({
	...routeParams,
	verb: 'get',
	statusCode: StatusCodes.OK,
});

const testDeleteCustomer = testProcessRoute.singleData({
	...routeParams,
	verb: 'delete',
	statusCode: StatusCodes.NO_CONTENT,
});

const testGetNonExistentCustomer = testProcessRoute.singleData({
	...routeParams,
	verb: 'get',
	statusCode: StatusCodes.NOT_FOUND,
});

export {
	testCreateCustomer,
	testGetCustomer,
	testDeleteCustomer,
	testGetNonExistentCustomer,
};
