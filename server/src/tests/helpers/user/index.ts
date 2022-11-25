import chai from 'chai';
import chaiHttp from 'chai-http';
import { UserDataSchemaDB } from 'app-schema/users';
import application from 'application';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import { updateUser, updateUserPassword } from 'tests/authentication/user-data';
import testProcessRoute from '../test-process-route';

chai.use(chaiHttp).should();

const { OK, NOT_FOUND, NO_CONTENT } = StatusCodes;

let validateResult = (data: any) => {
	let userInfo = data;
	userInfo.should.be.an('object');
	Joi.assert(userInfo, UserDataSchemaDB);
};

const routeParams = {
	server: application,
	baseUrl: '/api/v1/user',
	checks: validateResult,
};

const testGetUser = testProcessRoute({
	verb: 'get',
	statusCode: OK,
	...routeParams,
});

const testUpdateUser = testProcessRoute({
	verb: 'patch',
	statusCode: OK,
	dataList: updateUser,
	...routeParams,
});

const testChangeUserPassword = testProcessRoute({
	verb: 'patch',
	statusCode: NO_CONTENT,
	// TODO: each user data object should be a dictionary storing the token or userId
	// updateUserPassword[token] ==> correct password
	dataList: [updateUserPassword[0]],
	...routeParams,
	baseUrl: routeParams.baseUrl + '/password',
});

const testDeleteUser = testProcessRoute({
	verb: 'delete',
	statusCode: OK,
	...routeParams,
});

const testGetNonExistentUser = testProcessRoute({
	verb: 'get',
	statusCode: NOT_FOUND,
	...routeParams,
});

export {
	testGetUser,
	testUpdateUser,
	testChangeUserPassword,
	testDeleteUser,
	testGetNonExistentUser,
};
