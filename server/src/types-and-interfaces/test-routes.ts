import { StatusCodes } from 'http-status-codes'

export interface TestCreateRequestParams {
  verb: string
  statusCode: StatusCodes
}

export type TestCreateRequest = (
  server: string,
  token: string,
  path: string,
  validateResData: (data: unknown) => boolean
) => Promise<any>

export type TestCreateRequestWithQParams = (
  query: { [k: string]: any } & { length?: never }
) => Promise<any> & TestCreateRequest

export type TestCreateRequestWithQParamsPublic = (
  query: { [k: string]: any } & { length?: never } & { public: true }
) => Promise<any> & TestCreateRequest

export type TestCreateRequestWithBody = (
  body: object & { length?: never },
  validateReqData: (data: unknown) => boolean
) => Promise<any> & TestCreateRequest

export type TestCreateRequestWithQParamsAndBody = TestCreateRequestWithBody &
  TestCreateRequestWithQParams
