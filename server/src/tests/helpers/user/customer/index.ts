import application from 'application';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { StatusCodes } from 'http-status-codes';
import { users } from 'tests/authentication/user-data';
import testProcessRoute from 'tests/helpers/test-process-route';

chai.use(chaiHttp).should();

let userTokens: string[] = [];
users.getUserTokens().then((tokens) => (userTokens = tokens));

const routeParams = {
	tokens: userTokens,
	server: application,
	url: '/api/v1/user/customer',
};

const testCreateCustomer = testProcessRoute({
	...routeParams,
	verb: 'post',
	checks: (response) => response.should.have.status(StatusCodes.CREATED),
});

const testGetCustomer = testProcessRoute({
	...routeParams,
	verb: 'get',
	checks: (response) => response.should.have.status(StatusCodes.NO_CONTENT),
});

const testDeleteCustomer = testProcessRoute({
	...routeParams,
	verb: 'delete',
	checks: (response) => response.should.have.status(StatusCodes.NO_CONTENT),
});

const testGetDeletedCustomer = testProcessRoute({
	...routeParams,
	verb: 'get',
	checks: (response) => response.should.have.status(StatusCodes.NOT_FOUND),
});

export {
	testCreateCustomer,
	testGetCustomer,
	testDeleteCustomer,
	testGetDeletedCustomer,
};
