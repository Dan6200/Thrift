import application from 'application';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { StatusCodes } from 'http-status-codes';
import * as testProcessRoute from 'tests/helpers/test-process-route';
// import path from 'path';
chai.use(chaiHttp).should();

const routeParams = {
	server: application,
	baseUrl: '/api/v1/user/vendor',
};

const testCreateVendor = testProcessRoute.singleData({
	verb: 'post',
	statusCode: StatusCodes.CREATED,
	...routeParams,
});

const testGetVendor = testProcessRoute.singleData({
	...routeParams,
	verb: 'get',
	statusCode: StatusCodes.OK,
});

const testDeleteVendor = testProcessRoute.singleData({
	...routeParams,
	verb: 'delete',
	statusCode: StatusCodes.NO_CONTENT,
});

const testGetNonExistentVendor = testProcessRoute.singleData({
	...routeParams,
	verb: 'get',
	statusCode: StatusCodes.NOT_FOUND,
});

export {
	testCreateVendor,
	testGetVendor,
	testDeleteVendor,
	testGetNonExistentVendor,
};
