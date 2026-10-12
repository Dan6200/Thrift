import util from 'util'
import chai from 'chai'
import { StatusCodes } from 'http-status-codes'
import testRequest from '../../test-request/index.js'
import { TestRequest, RequestParams } from '../../test-request/types.js'
import {
  StoreCreateRequestSchema,
  StoreGetAllRequestSchema,
  StoreGetRequestSchema,
  StoreUpdateRequestSchema,
  StoreDeleteRequestSchema,
  StoreDataResponseListSchema,
  StoreDataResponseSchema,
} from '#src/app-schema/stores.js'
import { validateTestData } from '../../helpers/test-validators.js'
import { assertRecentIsoTimestamp } from '../../helpers/assert-timestamp.js'
import StoreData from '#src/types/store-data.js'
import * as JDP from 'jsondiffpatch'
const jdp = JDP.create()

const { CREATED, OK, FORBIDDEN, UNAUTHORIZED, NO_CONTENT } = StatusCodes

const storePathBase = '/v1/stores'
const buildStorePath = (storeId: number) => `${storePathBase}/${storeId}`

// Request Validators
const validateStoreCreateReq = (data: unknown) =>
  validateTestData(
    StoreCreateRequestSchema,
    data,
    'Store Create Request Validation Error',
  )
const validateStoreGetAllReq = (data: unknown) =>
  validateTestData(
    StoreGetAllRequestSchema,
    data,
    'Store Get All Request Validation Error',
  )
const validateStoreGetReq = (data: unknown) =>
  validateTestData(
    StoreGetRequestSchema,
    data,
    'Store Get Request Validation Error',
  )
const validateStoreUpdateReq = (data: unknown) =>
  validateTestData(
    StoreUpdateRequestSchema,
    data,
    'Store Update Request Validation Error',
  )
const validateStoreDeleteReq = (data: unknown) =>
  validateTestData(
    StoreDeleteRequestSchema,
    data,
    'Store Delete Request Validation Error',
  )

// Response Validators
const validateStoreDataListRes = (data: unknown) =>
  validateTestData(
    StoreDataResponseListSchema,
    data,
    'Store Data List Response Validation Error',
  )
const validateStoreDataRes = (data: unknown) =>
  validateTestData(
    StoreDataResponseSchema,
    data,
    'Store Data Response Validation Error',
  )

const compareStoreData = (actual: any, expected: StoreData) => {
  const actualStore = actual as StoreData

  actualStore.store_name.should.equal(expected.store_name)
  expected.custom_domain &&
    actualStore.custom_domain.should.equal(expected.custom_domain)
  expected.favicon && actualStore.favicon.should.equal(expected.favicon)

  // Check store_address properties individually
  actualStore.store_address.address_line_1.should.equal(
    expected.store_address.address_line_1,
  )
  actualStore.store_address.address_line_2.should.equal(
    expected.store_address.address_line_2,
  )
  actualStore.store_address.city.should.equal(expected.store_address.city)
  actualStore.store_address.state.should.equal(expected.store_address.state)
  actualStore.store_address.zip_postal_code.should.equal(
    expected.store_address.zip_postal_code,
  )
  actualStore.store_address.country.should.equal(expected.store_address.country)

  // Check timestamps for store_address
  assertRecentIsoTimestamp(actualStore.store_address.created_at, {
    label: 'store_address.created_at',
  })
  assertRecentIsoTimestamp(actualStore.store_address.updated_at, {
    label: 'store_address.updated_at',
  })

  // Compare pages and sections
  if (expected.pages) {
    actualStore.pages!.length.should.equal(expected.pages.length)
    for (let i = 0; i < expected.pages.length; i++) {
      const actualPage = actualStore.pages![i]
      const expectedPage = expected.pages[i]
      actualPage.page_slug.should.equal(expectedPage.page_slug)
      actualPage.page_title.should.equal(expectedPage.page_title)
      actualPage.page_type.should.equal(expectedPage.page_type)
      if (expectedPage.sections) {
        actualPage.sections!.length.should.equal(expectedPage.sections.length)
        for (let j = 0; j < expectedPage.sections.length; j++) {
          const actualSection = actualPage.sections![j]
          const expectedSection = expectedPage.sections[j]
          actualSection.section_title.should.equal(
            expectedSection.section_title,
          )
          actualSection.section_type.should.equal(expectedSection.section_type)
          actualSection.sort_order.should.equal(expectedSection.sort_order)
          assertRecentIsoTimestamp(actualSection.created_at, {
            label: 'section.created_at',
          })
          assertRecentIsoTimestamp(actualSection.updated_at, {
            label: 'section.updated_at',
          })
        }
      }
    }
  }

  // Check that timestamps are parseable ISO strings within a generous window
  assertRecentIsoTimestamp(actualStore.created_at, { label: 'created_at' })
  assertRecentIsoTimestamp(actualStore.updated_at, { label: 'updated_at' })

  return true
}

export const testCreateStore = (args: {
  token: string
  body: any
  expectedData: StoreData
}) => {
  const requestParams: RequestParams = {
    token: args.token,
    body: args.body,
  }
  return (testRequest as TestRequest)({
    verb: 'post',
    statusCode: CREATED,
    path: storePathBase,
    validateTestReqData: validateStoreCreateReq,
    validateTestResData: validateStoreDataRes,
    compareData: (actual, expected) =>
      compareStoreData(actual, expected as StoreData),
    expectedData: args.expectedData,
  })(requestParams)
}

export const testGetAllStores = (args: {
  token: string
  query?: { vendor_id?: string }
}) => {
  const requestParams: RequestParams = {
    token: args.token,
    query: args.query || {},
  }
  return (testRequest as TestRequest)({
    statusCode: OK,
    verb: 'get',
    path: storePathBase,
    validateTestReqData: validateStoreGetAllReq,
    validateTestResData: validateStoreDataListRes,
  })(requestParams)
}

export const testGetStore = (args: {
  token: string
  params: { storeId: number }
  query?: { vendor_id?: string }
  expectedData: StoreData
}) => {
  const path = buildStorePath(args.params.storeId)
  const requestParams: RequestParams = {
    token: args.token,
    params: args.params,
    query: args.query || {},
  }
  return (testRequest as TestRequest)({
    statusCode: OK,
    verb: 'get',
    path,
    validateTestReqData: validateStoreGetReq,
    validateTestResData: validateStoreDataRes,
    compareData: (actual, expected) =>
      compareStoreData(actual, expected as StoreData),
    expectedData: args.expectedData,
  })(requestParams)
}

export const testUpdateStore = (args: {
  token: string
  params: { storeId: number }
  body: any
  expectedData: StoreData
}) => {
  const path = buildStorePath(args.params.storeId)
  const requestParams: RequestParams = {
    token: args.token,
    body: args.body,
    params: args.params,
  }
  return (testRequest as TestRequest)({
    statusCode: OK,
    verb: 'patch',
    path,
    validateTestReqData: validateStoreUpdateReq,
    validateTestResData: validateStoreDataRes,
    compareData: (actual, expected) =>
      compareStoreData(actual, expected as StoreData),
    expectedData: args.expectedData,
  })(requestParams)
}

export const testDeleteStore = (args: {
  token: string
  params: { storeId: number }
}) => {
  const path = buildStorePath(args.params.storeId)
  const requestParams: RequestParams = {
    token: args.token,
    params: args.params,
  }
  return (testRequest as TestRequest)({
    statusCode: NO_CONTENT,
    verb: 'delete',
    path,
    validateTestReqData: validateStoreDeleteReq,
    validateTestResData: null,
  })(requestParams)
}

export const testGetNonExistentStore = (args: {
  token: string
  params: { storeId: number }
}) => {
  const path = buildStorePath(args.params.storeId)
  const requestParams: RequestParams = {
    token: args.token,
    params: args.params,
  }
  return (testRequest as TestRequest)({
    verb: 'get',
    statusCode: FORBIDDEN, // not NOT_FOUND because the user would not have access to a store that doesn't exist
    path,
    validateTestReqData: validateStoreGetReq,
    validateTestResData: null,
  })(requestParams)
}

export const testCreateStoreWithoutSignin = (args: {
  token: string
  body: any
}) => {
  const requestParams: RequestParams = {
    token: args.token,
    body: args.body,
  }
  return (testRequest as TestRequest)({
    verb: 'post',
    statusCode: UNAUTHORIZED,
    path: storePathBase,
    validateTestReqData: validateStoreCreateReq,
  })(requestParams)
}

export const testUpdateStoreWithoutSignin = (args: {
  token: string
  params: { storeId: number }
  body: any
}) => {
  const path = buildStorePath(args.params.storeId)
  const requestParams: RequestParams = {
    token: args.token,
    body: args.body,
    params: args.params,
  }
  return (testRequest as TestRequest)({
    statusCode: UNAUTHORIZED,
    verb: 'patch',
    path,
    validateTestReqData: validateStoreUpdateReq,
  })(requestParams)
}

export const testDeleteStoreWithoutSignin = (args: {
  token: string
  params: { storeId: number }
}) => {
  const path = buildStorePath(args.params.storeId)
  const requestParams: RequestParams = {
    token: args.token,
    params: args.params,
  }
  return (testRequest as TestRequest)({
    statusCode: UNAUTHORIZED,
    verb: 'delete',
    path,
    validateTestReqData: validateStoreDeleteReq,
  })(requestParams)
}
export const testCreateStoreWithoutVendorAccount = (args: {
  token: string
  body: any
}) => {
  const requestParams: RequestParams = {
    token: args.token,
    body: args.body,
  }
  return (testRequest as TestRequest)({
    verb: 'post',
    statusCode: FORBIDDEN,
    path: storePathBase,
    validateTestReqData: validateStoreCreateReq,
  })(requestParams)
}

export const testUpdateStoreWithoutVendorAccount = (args: {
  token: string
  params: { storeId: number }
  body: any
}) => {
  const path = buildStorePath(args.params.storeId)
  const requestParams: RequestParams = {
    token: args.token,
    body: args.body,
    params: args.params,
  }
  return (testRequest as TestRequest)({
    statusCode: FORBIDDEN,
    verb: 'patch',
    path,
    validateTestReqData: validateStoreUpdateReq,
  })(requestParams)
}

export const testDeleteStoreWithoutVendorAccount = (args: {
  token: string
  params: { storeId: number }
}) => {
  const path = buildStorePath(args.params.storeId)
  const requestParams: RequestParams = {
    token: args.token,
    params: args.params,
  }
  return (testRequest as TestRequest)({
    statusCode: FORBIDDEN,
    verb: 'delete',
    path,
    validateTestReqData: validateStoreDeleteReq,
  })(requestParams)
}
