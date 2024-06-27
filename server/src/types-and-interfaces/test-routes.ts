import { StatusCodes } from 'http-status-codes'

export interface TestCreateRequestParams {
  verb: 'get' | 'post' | 'delete' | 'put' | 'patch'
  statusCode: StatusCodes
  validateResData: (data: unknown) => boolean
}

export type TestCreateRequest = (
  testCreateRequestParams: TestCreateRequestParams
) => TestCreateRequestInner

export type TestCreateRequestWithBody = (
  testCreateRequestParams: TestCreateRequestParams & {
    validateReqData: (data: unknown) => boolean
  }
) => TestCreateRequestInner

type TestCreateRequestInner = ({
  server,
  token,
  path,
}: {
  server: string
  token: string
  path: string
  query?: { [k: string]: any } & { length?: never }
  body?: object & { length: never }
}) => Promise<any>
