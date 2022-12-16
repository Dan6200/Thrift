import chai from 'chai';
import chaiHttp from 'chai-http';
import { StatusCodes } from 'http-status-codes';
import app from '../../../../app';
import testProcessRoute from '../../test-process-route';
// import path from 'path';
chai.use(chaiHttp).should();

const routeParams = {
	server: app,
	baseUrl: '/api/v1/user/vendor',
};

const testCreateVendor = testProcessRoute({
	verb: 'post',
	statusCode: StatusCodes.CREATED,
	...routeParams,
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

const testGetNonExistentVendor = testProcessRoute({
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
