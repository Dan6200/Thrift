import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import {
  testRequestNoData,
  testRequestWithData,
} from '../../../../types-and-interfaces/test-routes.js'
import {
  isValidUserResponseData,
  UserResponseData,
} from '../../../../types-and-interfaces/user.js'
import testRequest from '../test-route.js'

chai.use(chaiHttp).should()

const { OK, NOT_FOUND, UNAUTHORIZED } = StatusCodes

let validateResult = (data: unknown): data is UserResponseData =>
  isValidUserResponseData(data)

const hasNoCustomerAccount = (data: unknown) => {
  const isValidData = validateResult(data)
  if (!isValidData) throw new Error('Invalid User Data Response')
  data.is_customer.should.be.false
  return true
}

const hasCustomerAccount = (data: unknown) => {
  const isValidData = validateResult(data)
  if (!isValidData) throw new Error('Invalid User Data Response')
  data.is_customer.should.be.true
  return true
}

const hasVendorAccount = (data: unknown) => {
  const isValidData = validateResult(data)
  if (!isValidData) throw new Error('Invalid User Data Response')
  data.is_vendor.should.be.true
  return true
}

const hasNoVendorAccount = (data: unknown) => {
  const isValidData = validateResult(data)
  if (!isValidData) throw new Error('Invalid User Data Response')
  data.is_vendor.should.be.false
  return true
}

export const testFailToGetUser = testRequest({
  verb: 'get',
  statusCode: UNAUTHORIZED,
}) as testRequestNoData

export const testHasCustomerAccount = testRequest({
  verb: 'get',
  statusCode: OK,
  checks: hasCustomerAccount,
}) as testRequestNoData

export const testHasNoCustomerAccount = testRequest({
  verb: 'get',
  statusCode: OK,
  checks: hasNoCustomerAccount,
}) as testRequestNoData

export const testHasVendorAccount = testRequest({
  verb: 'get',
  statusCode: OK,
  checks: hasVendorAccount,
}) as testRequestNoData

export const testHasNoVendorAccount = testRequest({
  verb: 'get',
  statusCode: OK,
  checks: hasNoVendorAccount,
}) as testRequestNoData

export const testGetUser = testRequest({
  verb: 'get',
  statusCode: OK,
  checks: validateResult,
}) as testRequestNoData

export const testUpdateUser = testRequest({
  verb: 'patch',
  statusCode: OK,
}) as testRequestWithData

export const testDeleteUser = testRequest({
  verb: 'delete',
  statusCode: OK,
}) as testRequestNoData

export const testGetNonExistentUser = testRequest({
  verb: 'get',
  statusCode: NOT_FOUND,
}) as testRequestNoData
