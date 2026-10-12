import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import { TestRequest, RequestParams } from '../test-request/types.js'
import testRequest from '../test-request/index.js'
import { ProfileResponseSchema } from '#src/app-schema/profiles.js'
import { validateTestData } from '../helpers/test-validators.js'
import { assertRecentIsoTimestamp } from '../helpers/assert-timestamp.js'
import { ProfileData, ProfileRequestData } from '#src/types/profile/index.js'

chai.use(chaiHttp).should()

const { OK, UNAUTHORIZED } = StatusCodes

const profilePath = '/v1/me'

const validateProfileResponse = (data: unknown) =>
  validateTestData(
    ProfileResponseSchema,
    data,
    'User Profile Response Validation Error',
  )

const compareProfileData = (actual: any, expected: ProfileRequestData) => {
  validateProfileResponse(actual)
  const actualProfile = actual as ProfileData

  actualProfile.first_name.should.equal(expected.first_name)
  actualProfile.last_name.should.equal(expected.last_name)
  actualProfile.email.should.equal(expected.email)

  // DOB comparison: convert expected DOB to ISO string to avoid timezone issues
  const expectedDob = new Date(expected.dob).toISOString()

  actualProfile.dob.should.equal(expectedDob)

  actualProfile.country.should.equal(expected.country)
  actualProfile.is_customer.should.equal(expected.is_customer)
  actualProfile.is_vendor.should.equal(expected.is_vendor)

  // Check that timestamps are parseable ISO strings within a generous window
  assertRecentIsoTimestamp(actualProfile.created_at, { label: 'created_at' })
  assertRecentIsoTimestamp(actualProfile.updated_at, { label: 'updated_at' })

  return true
}

export const testGetProfile = (args: {
  token: string
  expectedData: ProfileRequestData
}) => {
  const requestParams: RequestParams = {
    token: args.token,
  }
  return (testRequest as TestRequest)({
    verb: 'get',
    statusCode: OK,
    path: profilePath,
    validateTestResData: validateProfileResponse,
    compareData: (actual, expected) =>
      compareProfileData(actual, expected as ProfileRequestData),
    expectedData: args.expectedData,
  })(requestParams)
}

export const testHasCustomerAccount = (args: {
  token: string
  expectedData: ProfileRequestData
}) => {
  const requestParams: RequestParams = {
    token: args.token,
  }
  return (testRequest as TestRequest)({
    verb: 'get',
    statusCode: OK,
    path: profilePath,
    validateTestResData: validateProfileResponse,
    compareData: (actual, expected) =>
      compareProfileData(actual, expected as ProfileRequestData),
    expectedData: args.expectedData,
  })(requestParams)
}

export const testHasVendorAccount = (args: {
  token: string
  expectedData: ProfileRequestData
}) => {
  const requestParams: RequestParams = {
    token: args.token,
  }
  return (testRequest as TestRequest)({
    verb: 'get',
    statusCode: OK,
    path: profilePath,
    validateTestResData: validateProfileResponse,
    compareData: (actual, expected) =>
      compareProfileData(actual, expected as ProfileRequestData),
    expectedData: args.expectedData,
  })(requestParams)
}

export const testHasNoVendorAccount = (args: {
  token: string
  expectedData: ProfileRequestData
}) => {
  const requestParams: RequestParams = {
    token: args.token,
  }
  return (testRequest as TestRequest)({
    verb: 'get',
    statusCode: OK,
    path: profilePath,
    validateTestResData: validateProfileResponse,
    compareData: (actual, expected) =>
      compareProfileData(actual, expected as ProfileRequestData),
    expectedData: args.expectedData,
  })(requestParams)
}

export const testGetProfileWithoutSignIn = () => {
  return (testRequest as TestRequest)({
    verb: 'get',
    statusCode: UNAUTHORIZED,
    path: profilePath,
  })({})
}

export const testHasCustomerAccountWithoutSignIn = () => {
  return (testRequest as TestRequest)({
    verb: 'get',
    statusCode: OK,
    path: profilePath,
    validateTestResData: validateProfileResponse,
    compareData: (actual, expected) =>
      compareProfileData(actual, expected as ProfileRequestData),
  })({})
}
