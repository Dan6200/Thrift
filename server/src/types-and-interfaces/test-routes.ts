import { StatusCodes } from 'http-status-codes'

export type TestCreateRequestParams = {
  verb: 'get' | 'post' | 'delete' | 'put' | 'patch'
  statusCode: StatusCodes
  validateResData: (data: unknown) => boolean
}

export type TestCreateRequestParamsGeneral = {
  validateReqData?: (data: unknown) => boolean
} & TestCreateRequestParams

export type TestCreateRequest = (
  testCreateRequestParams: TestCreateRequestParams
) => TestCreateRequestInner

export type TestCreateRequestWithQParams = (
  testCreateRequestParams: TestCreateRequestParams & {
    validateReqData: (data: unknown) => boolean
  }
) => TestCreateRequestInner

export type TestCreateRequestWithQueryAndBody = (
  testCreateRequestParams: TestCreateRequestParams & {
    validateReqData: (data: unknown) => boolean
  }
) => TestCreateRequestInnerWQueryNBody

export type TestCreateRequestWithQuery = (
  testCreateRequestParams: TestCreateRequestParams & {
    validateReqData: (data: unknown) => boolean
  }
) => TestCreateRequestInnerWQuery

export type TestCreateRequestWithBody = (
  testCreateRequestParams: TestCreateRequestParams & {
    validateReqData: (data: unknown) => boolean
  }
) => TestCreateRequestInnerWBody

type TestCreateRequestInnerWBody = <T>(
  createRequestParams: CreateRequestParams & { body: T }
) => Promise<any>

type TestCreateRequestInnerWQuery = <T>(
  createRequestParams: CreateRequestParams & {
    query: { [k: string]: any } | null
  }
) => Promise<any>

type TestCreateRequestInnerWQueryNBody = <T>(
  createRequestParams: CreateRequestParams & { body: T } & {
    query: { [k: string]: any } | null
  }
) => Promise<any>

type TestCreateRequestInner = (
  createRequestParams: CreateRequestParams
) => Promise<any>

export type CreateRequestParams = {
  server: string
  token: string
  path: string
}
