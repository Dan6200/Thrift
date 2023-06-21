import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { UserDataSchemaDB } from '../../../app-schema/users.js'
import {
	testRouteWithData,
	testRouteNoData,
} from '../../../types-and-interfaces/test-routes.js'
import testRoute from '../test-route.js'

chai.use(chaiHttp).should()

const { OK, NOT_FOUND, NO_CONTENT, UNAUTHORIZED } = StatusCodes

let validateResult = (data: any) => {
	// TODO:rewrite this!!
	let userInfo = data
	userInfo.should.be.an('object')
}

const testDontGetUser = testRoute({
	verb: 'get',
	statusCode: UNAUTHORIZED,
}) as testRouteNoData

const testGetUser = testRoute({
	verb: 'get',
	statusCode: OK,
	checks: validateResult,
}) as testRouteNoData

const testUpdateUser = testRoute({
	verb: 'patch',
	statusCode: OK,
	checks: validateResult,
}) as testRouteWithData

const testChangeUserPassword = testRoute({
	verb: 'patch',
	statusCode: NO_CONTENT,
}) as testRouteWithData

const testDeleteUser = testRoute({
	verb: 'delete',
	statusCode: NO_CONTENT,
}) as testRouteNoData

const testGetNonExistentUser = testRoute({
	verb: 'get',
	statusCode: NOT_FOUND,
}) as testRouteNoData

export {
	testGetUser,
	testDontGetUser,
	testUpdateUser,
	testChangeUserPassword,
	testDeleteUser,
	testGetNonExistentUser,
}
