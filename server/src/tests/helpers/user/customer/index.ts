import chai from 'chai';
import chaiHttp from 'chai-http';
import { StatusCodes } from 'http-status-codes';
import app from '../../../../app';
import testProcessRoute from '../../test-process-route';
// import path from 'path';
chai.use(chaiHttp).should();

const routeParams = {
	server: app,
	baseUrl: '/api/v1/user/customer',
};

const testCreateCustomer = testProcessRoute({
	...routeParams,
	verb: 'post',
	statusCode: StatusCodes.CREATED,
});

const testGetCustomer = testProcessRoute({
	...routeParams,
	verb: 'get',
	statusCode: StatusCodes.OK,
});

const testDeleteCustomer = testProcessRoute({
	...routeParams,
	verb: 'delete',
	statusCode: StatusCodes.NO_CONTENT,
});

const testGetNonExistentCustomer = testProcessRoute({
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
