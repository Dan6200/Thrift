import { StatusCodes } from 'http-status-codes'
import testRequest from '../../test-request/index.js'
import { TestRequest, RequestParams } from '../../test-request/types.js'
import {
  AddStoreStaffRequestSchema,
  ListStoreStaffRequestSchema,
  UpdateStoreStaffRequestSchema,
  RemoveStoreStaffRequestSchema,
  StoreStaffResponseSchema,
  StoreStaffListResponseSchema,
} from '#src/app-schema/store_staff.js'
import { validateTestData } from '../../helpers/test-validators.js'
import { assertRecentIsoTimestamp } from '../../helpers/assert-timestamp.js'
import { StoreStaff } from '#src/types/store_staff.js'
import chai from 'chai'

const { CREATED, OK, NO_CONTENT, FORBIDDEN } = StatusCodes

const storeStaffPath = (storeId: number) => `/v1/stores/${storeId}/staff`
const storeStaffIdPath = (storeId: number, staffId: string) =>
  `/v1/stores/${storeId}/staff/${staffId}`

// Request Validators
const validateAddStaffReq = (data: unknown) =>
  validateTestData(
    AddStoreStaffRequestSchema,
    data,
    'Add Store Staff Request Validation Error',
  )
const validateListStaffReq = (data: unknown) =>
  validateTestData(
    ListStoreStaffRequestSchema,
    data,
    'List Store Staff Request Validation Error',
  )
const validateUpdateStaffReq = (data: unknown) =>
  validateTestData(
    UpdateStoreStaffRequestSchema,
    data,
    'Update Store Staff Request Validation Error',
  )
const validateRemoveStaffReq = (data: unknown) =>
  validateTestData(
    RemoveStoreStaffRequestSchema,
    data,
    'Remove Store Staff Request Validation Error',
  )

// Response Validators
const validateStaffRes = (data: unknown) =>
  validateTestData(
    StoreStaffResponseSchema,
    data,
    'Store Staff Response Validation Error',
  )
const validateStaffListRes = (data: unknown) =>
  validateTestData(
    StoreStaffListResponseSchema,
    data,
    'Store Staff List Response Validation Error',
  )

const compareStoreStaffData = (actual: any, expected: StoreStaff) => {
  validateStaffRes(actual)
  const actualStaff = actual as StoreStaff

  actualStaff.staff_id.should.equal(expected.staff_id)
  actualStaff.role.should.equal(expected.role)

  // Check that timestamps are parseable ISO strings within a generous window
  assertRecentIsoTimestamp(actualStaff.created_at, { label: 'created_at' })
  assertRecentIsoTimestamp(actualStaff.updated_at, { label: 'updated_at' })

  return true
}

export const testAddStaff = (args: {
  token: string
  params: { storeId: number }
  body: any
  expectedData: StoreStaff
}) => {
  const requestParams: RequestParams = {
    token: args.token,
    body: args.body,
    params: args.params,
  }
  return (testRequest as TestRequest)({
    verb: 'post',
    statusCode: CREATED,
    path: storeStaffPath(args.params.storeId),
    validateTestReqData: validateAddStaffReq,
    validateTestResData: validateStaffRes,
    compareData: (actual, expected) =>
      compareStoreStaffData(actual, expected as StoreStaff),
    expectedData: args.expectedData,
  })(requestParams)
}

export const testListStaff = (args: {
  token: string
  params: { storeId: number }
}) => {
  const requestParams: RequestParams = {
    token: args.token,
    params: args.params,
  }
  return (testRequest as TestRequest)({
    verb: 'get',
    statusCode: OK,
    path: storeStaffPath(args.params.storeId),
    validateTestReqData: validateListStaffReq,
    validateTestResData: validateStaffListRes,
  })(requestParams)
}

export const testUpdateStaff = (args: {
  token: string
  params: { storeId: number; staffId: string }
  body: any
  expectedData: StoreStaff
}) => {
  const requestParams: RequestParams = {
    token: args.token,
    body: args.body,
    params: args.params,
  }
  return (testRequest as TestRequest)({
    verb: 'patch',
    statusCode: OK,
    path: storeStaffIdPath(args.params.storeId, args.params.staffId),
    validateTestReqData: validateUpdateStaffReq,
    validateTestResData: validateStaffRes,
    compareData: (actual, expected) =>
      compareStoreStaffData(actual, expected as StoreStaff),
    expectedData: args.expectedData,
  })(requestParams)
}

export const testRemoveStaff = (args: {
  token: string
  params: { storeId: number; staffId: string }
}) => {
  const requestParams: RequestParams = {
    token: args.token,
    params: args.params,
  }
  return (testRequest as TestRequest)({
    verb: 'delete',
    statusCode: NO_CONTENT,
    path: storeStaffIdPath(args.params.storeId, args.params.staffId),
    validateTestReqData: validateRemoveStaffReq,
    validateTestResData: null,
  })(requestParams)
}

export const testAddStaffUnauthorized = (args: {
  token: string
  params: { storeId: number }
  body: any
}) => {
  const requestParams: RequestParams = {
    token: args.token,
    body: args.body,
    params: args.params,
  }
  return (testRequest as TestRequest)({
    verb: 'post',
    statusCode: FORBIDDEN,
    path: storeStaffPath(args.params.storeId),
    validateTestReqData: validateAddStaffReq,
  })(requestParams)
}

export const testListStaffUnauthorized = (args: {
  token: string
  params: { storeId: number }
}) => {
  const requestParams: RequestParams = {
    token: args.token,
    params: args.params,
  }
  return (testRequest as TestRequest)({
    verb: 'get',
    statusCode: FORBIDDEN,
    path: storeStaffPath(args.params.storeId),
    validateTestReqData: validateListStaffReq,
  })(requestParams)
}

export const testUpdateStaffUnauthorized = (args: {
  token: string
  params: { storeId: number; staffId: string }
  body: any
}) => {
  const requestParams: RequestParams = {
    token: args.token,
    body: args.body,
    params: args.params,
  }
  return (testRequest as TestRequest)({
    verb: 'patch',
    statusCode: FORBIDDEN,
    path: storeStaffIdPath(args.params.storeId, args.params.staffId),
    validateTestReqData: validateUpdateStaffReq,
  })(requestParams)
}

export const testRemoveStaffUnauthorized = (args: {
  token: string
  params: { storeId: number; staffId: string }
}) => {
  const requestParams: RequestParams = {
    token: args.token,
    params: args.params,
  }
  return (testRequest as TestRequest)({
    verb: 'delete',
    statusCode: FORBIDDEN,
    path: storeStaffIdPath(args.params.storeId, args.params.staffId),
    validateTestReqData: validateRemoveStaffReq,
  })(requestParams)
}
