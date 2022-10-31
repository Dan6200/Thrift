import application from 'application';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { StatusCodes } from 'http-status-codes';
import { users } from 'tests/authentication/user-data';
import testProcessRoute from 'tests/helpers/test-process-route';
// import path from 'path';
chai.use(chaiHttp).should();

const routeParams = {
	server: application,
	url: '/api/v1/user/customer',
	users,
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

const testGetDeletedCustomer = testProcessRoute({
	...routeParams,
	verb: 'get',
	statusCode: StatusCodes.NOT_FOUND,
});

export {
	testCreateCustomer,
	testGetCustomer,
	testDeleteCustomer,
	testGetDeletedCustomer,
};
