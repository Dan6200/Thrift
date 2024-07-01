import { StatusCodes } from 'http-status-codes'

export type TestCreateRequestParams = {
  verb: 'get' | 'post' | 'delete' | 'put' | 'patch'
  statusCode: StatusCodes
  validateResData: (data: unknown) => Promise<boolean>
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

export type TestCreateRequestWithBody = (
  testCreateRequestParams: TestCreateRequestParams & {
    validateReqData: (data: unknown) => boolean
  }
) => TestCreateRequestInnerWBody

type TestCreateRequestInnerWBody = <T>(
  createRequestParams: CreateRequestParams & { body: T }
) => Promise<any>

type TestCreateRequestInner = (
  createRequestParams: CreateRequestParams
) => Promise<any>

export type CreateRequestParams = {
  server: string
  token: string
  path: string
}
