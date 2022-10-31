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
	url: '/api/v1/user/vendor',
	users,
};

const testCreateVendor = testProcessRoute({
	...routeParams,
	verb: 'post',
	statusCode: StatusCodes.CREATED,
});

const testGetVendor = testProcessRoute({
	...routeParams,
	verb: 'get',
	statusCode: StatusCodes.OK,
});

const testDeleteVendor = testProcessRoute({
	...routeParams,
	verb: 'delete',
	statusCode: StatusCodes.NO_CONTENT,
});

const testGetDeletedVendor = testProcessRoute({
	...routeParams,
	verb: 'get',
	statusCode: StatusCodes.NOT_FOUND,
});

export {
	testCreateVendor,
	testGetVendor,
	testDeleteVendor,
	testGetDeletedVendor,
};
