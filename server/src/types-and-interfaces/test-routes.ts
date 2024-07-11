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

export type TestCreateRequestWithQParamsAndBody = (
  testCreateRequestParams: TestCreateRequestParams & {
    validateReqData: (data: unknown) => boolean
  }
) => TestCreateRequestInnerWQueryNBody

export type TestCreateRequestPublic = (
  testCreateRequestParams: TestCreateRequestParams
) => TestCreateRequestPublicInner

export type TestCreateRequestWithQParams = (
  testCreateRequestParams: TestCreateRequestParams
) => TestCreateRequestInnerWQuery

export type TestCreateRequestWithBody = (
  testCreateRequestParams: TestCreateRequestParams & {
    validateReqData: (data: unknown) => boolean
  }
) => TestCreateRequestInnerWBody

type TestCreateRequestInnerWBody = <T>(
  createRequestParams: CreateRequestParams & { body: T }
) => Promise<any>

type TestCreateRequestPublicInner = <T>(
  createRequestParams: Omit<CreateRequestParams, 'token'> & {
    query: { [k: string]: any } | null
  }
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
