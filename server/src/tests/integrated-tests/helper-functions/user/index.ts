import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import {
  TestCreateRequest,
  TestCreateRequestWithBody,
} from '../../../../types-and-interfaces/test-routes.js'
import {
  isValidUserResponseData,
  UserResponseData,
} from '../../../../types-and-interfaces/user.js'
import testCreateRequest from '../test-route.js'

chai.use(chaiHttp).should()

const { OK, NOT_FOUND, CREATED, UNAUTHORIZED } = StatusCodes

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

export const testFailToGetUser = testCreateRequest({
  verb: 'get',
  statusCode: UNAUTHORIZED,
}) as TestCreateRequest

export const testHasCustomerAccount = testCreateRequest({
  verb: 'get',
  statusCode: OK,
  checks: hasCustomerAccount,
}) as TestCreateRequest

export const testHasNoCustomerAccount = testCreateRequest({
  verb: 'get',
  statusCode: OK,
  checks: hasNoCustomerAccount,
}) as TestCreateRequest

export const testHasVendorAccount = testCreateRequest({
  verb: 'get',
  statusCode: OK,
  checks: hasVendorAccount,
}) as TestCreateRequest

export const testHasNoVendorAccount = testCreateRequest({
  verb: 'get',
  statusCode: OK,
  checks: hasNoVendorAccount,
}) as TestCreateRequest

export const testPostUser = testCreateRequest({
  verb: 'post',
  statusCode: CREATED,
  checks: validateResult,
}) as TestCreateRequestWithBody

export const testGetUser = testCreateRequest({
  verb: 'get',
  statusCode: OK,
  checks: validateResult,
}) as TestCreateRequest

export const testUpdateUser = testCreateRequest({
  verb: 'patch',
  statusCode: OK,
}) as TestCreateRequestWithBody

export const testDeleteUser = testCreateRequest({
  verb: 'delete',
  statusCode: OK,
}) as TestCreateRequest

export const testGetNonExistentUser = testCreateRequest({
  verb: 'get',
  statusCode: NOT_FOUND,
}) as TestCreateRequest
