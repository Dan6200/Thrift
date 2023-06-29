import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { AccountDataSchemaDB } from '../../../../app-schema/account.js'
import {
	testRouteNoData,
	testRouteWithData,
} from '../../../../types-and-interfaces/test-routes.js'
import testRoute from '../test-route.js'

chai.use(chaiHttp).should()

const { OK, NOT_FOUND, NO_CONTENT, UNAUTHORIZED } = StatusCodes

let validateResult = async (data: any) => {
	let userInfo = data
	userInfo.should.be.an('object')
	Joi.assert(userInfo, AccountDataSchemaDB)
}

const testFailToGetAccount = testRoute({
	verb: 'get',
	statusCode: UNAUTHORIZED,
}) as testRouteNoData

const testGetAccount = testRoute({
	verb: 'get',
	statusCode: OK,
	checks: validateResult,
}) as testRouteNoData

const testUpdateAccount = testRoute({
	verb: 'patch',
	statusCode: NO_CONTENT,
}) as testRouteWithData

const testChangeAccountPassword = testRoute({
	verb: 'put',
	statusCode: NO_CONTENT,
}) as testRouteWithData

const testDeleteAccount = testRoute({
	verb: 'delete',
	statusCode: NO_CONTENT,
}) as testRouteNoData

const testGetNonExistentAccount = testRoute({
	verb: 'get',
	statusCode: NOT_FOUND,
}) as testRouteNoData

export {
	testGetAccount,
	testFailToGetAccount,
	testUpdateAccount,
	testChangeAccountPassword,
	testDeleteAccount,
	testGetNonExistentAccount,
}
