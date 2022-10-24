import application from 'application';
import chai from 'chai';
import chaiHttp from 'chai-http';
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
const testCreateCustomer = testProcessRoute({ ...routeParams, verb: 'post' });
const testGetCustomer = testProcessRoute({ ...routeParams, verb: 'get' });
const testDeleteCustomer = testProcessRoute({ ...routeParams, verb: 'delete' });

export { testCreateCustomer, testGetCustomer, testDeleteCustomer };
