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

export type TestCreateRequestWithQParams = <T>(
  testCreateRequestParams: TestCreateRequestParams & {
    validateReqData: (data: unknown) => boolean
  }
) => TestCreateRequestWithBodyInner<T>

export type TestCreateRequestWithBody = <T>(
  testCreateRequestParams: TestCreateRequestParams & {
    validateReqData: (data: unknown) => boolean
  }
) => TestCreateRequestWithBodyInner<T>

type TestCreateRequestInner = ({
  server,
  token,
  path,
}: {
  server: string
  token: string
  path: string
  query?: { [k: string]: any } & { length?: never }
}) => Promise<any>

type TestCreateRequestWithBodyInner<T> = TestCreateRequestInner & { body: T }
