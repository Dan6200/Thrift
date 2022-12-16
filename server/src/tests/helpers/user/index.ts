import chai from 'chai';
import chaiHttp from 'chai-http';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import testProcessRoute from '../test-process-route';
import { UserDataSchemaDB } from '../../../app-schema/users';
import { updateUser, updateUserPassword } from '../../authentication/user-data';
import app from '../../../app';

chai.use(chaiHttp).should();

const { OK, NOT_FOUND, NO_CONTENT } = StatusCodes;

let validateResult = (data: any) => {
	let userInfo = data;
	userInfo.should.be.an('object');
	Joi.assert(userInfo, UserDataSchemaDB);
};

const routeParams = {
	server: app,
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
	dataMatrix: updateUser,
	...routeParams,
});

const testChangeUserPassword = testProcessRoute({
	verb: 'patch',
	statusCode: NO_CONTENT,
	dataMatrix: updateUserPassword,
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
