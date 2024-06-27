import { StatusCodes } from 'http-status-codes'

export interface TestCreateRequestParams {
  verb: string
  statusCode: StatusCodes
  checks?: (data: unknown) => boolean
}

export type TestCreateRequest = (
  server: string,
  token: string,
  path: string
) => Promise<any>

export type TestCreateRequestPublic = (
  server: string,
  token: null,
  path: string
) => Promise<any>

export type TestCreateRequestWithQParams = (
  server: string,
  token: string,
  path: string,
  query: { [k: string]: any } & { length?: never }
) => Promise<any>

export type TestCreateRequestWithQParamsPublic = (
  server: string,
  token: null,
  path: string,
  query: { [k: string]: any } & { length?: never }
) => Promise<any>

export type TestCreateRequestWithQParamsAndBody = (
  server: string,
  token: string,
  path: string,
  query: { [k: string]: any } & { length?: never },
  body: object & { length?: never }
) => Promise<any>

export type TestCreateRequestWithBody = (
  server: string,
  token: string,
  path: string,
  query: null,
  body: object & { length?: never }
) => Promise<any>
