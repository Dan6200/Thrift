import { StatusCodes } from 'http-status-codes'

interface testRequestParams {
  verb: string
  statusCode: StatusCodes
  checks?: (data: unknown) => boolean
}

type testRequestNoData = (
  server: string,
  token: string,
  path: string
) => Promise<any>

export type testPublicRequestNoData = (
  server: string,
  token: null,
  path: string
) => Promise<any>

export type testRequestWithQParams = (
  server: string,
  token: string,
  path: string,
  query: { [k: string]: any } & { length?: never }
) => Promise<any>

export type testPublicRequestWithQParams = (
  server: string,
  token: null,
  path: string,
  query: { [k: string]: any } & { length?: never }
) => Promise<any>

export type testRequestWithQParamsAndData = (
  server: string,
  token: string,
  path: string,
  query: { [k: string]: any } & { length?: never },
  data: object & { length?: never }
) => Promise<any>

type testRequestWithData = (
  server: string,
  token: string,
  path: string,
  query: null,
  data: object & { length?: never }
) => Promise<any>

export { testRequestParams, testRequestNoData, testRequestWithData }
