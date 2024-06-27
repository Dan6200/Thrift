import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { UserSchemaDBResponse } from '../../../../app-schema/users.js'
import {
  testRouteNoData,
  testRouteWithData,
} from '../../../../types-and-interfaces/test-routes.js'
import testRoute from '../test-route.js'

chai.use(chaiHttp).should()

const { OK, NOT_FOUND, UNAUTHORIZED } = StatusCodes

let validateResult = async (data: any) => {
  let userInfo = data
  userInfo.should.be.an('object')
  Joi.assert(userInfo, UserSchemaDBResponse)
}

const hasNoCustomerAccount = async (data: any) => {
  validateResult(data)
  data.is_customer.should.be.false
}

const hasCustomerAccount = async (data: any) => {
  validateResult(data)
  data.is_customer.should.be.true
}

const hasVendorAccount = async (data: any) => {
  validateResult(data)
  data.is_vendor.should.be.true
}

const hasNoVendorAccount = async (data: any) => {
  validateResult(data)
  data.is_vendor.should.be.false
}

export const testFailToGetUser = testRoute({
  verb: 'get',
  statusCode: UNAUTHORIZED,
}) as testRouteNoData

export const testHasCustomerAccount = testRoute({
  verb: 'get',
  statusCode: OK,
  checks: hasCustomerAccount,
}) as testRouteNoData

export const testHasNoCustomerAccount = testRoute({
  verb: 'get',
  statusCode: OK,
  checks: hasNoCustomerAccount,
}) as testRouteNoData

export const testHasVendorAccount = testRoute({
  verb: 'get',
  statusCode: OK,
  checks: hasVendorAccount,
}) as testRouteNoData

export const testHasNoVendorAccount = testRoute({
  verb: 'get',
  statusCode: OK,
  checks: hasNoVendorAccount,
}) as testRouteNoData

export const testGetUser = testRoute({
  verb: 'get',
  statusCode: OK,
  checks: validateResult,
}) as testRouteNoData

export const testUpdateUser = testRoute({
  verb: 'patch',
  statusCode: OK,
}) as testRouteWithData

export const testDeleteUser = testRoute({
  verb: 'delete',
  statusCode: OK,
}) as testRouteNoData

export const testGetNonExistentUser = testRoute({
  verb: 'get',
  statusCode: NOT_FOUND,
}) as testRouteNoData
