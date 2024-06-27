import { StatusCodes } from 'http-status-codes'

export interface testRequestParams {
  verb: string
  statusCode: StatusCodes
  checks?: (data: unknown) => boolean
}

export type testRequest = (
  server: string,
  token: string,
  path: string
) => Promise<any>

export type testRequestPublic = (
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

export type testRequestWithQParamsPublic = (
  server: string,
  token: null,
  path: string,
  query: { [k: string]: any } & { length?: never }
) => Promise<any>

export type testRequestWithQParamsAndBody = (
  server: string,
  token: string,
  path: string,
  query: { [k: string]: any } & { length?: never },
  body: object & { length?: never }
) => Promise<any>

export type testRequestWithBody = (
  server: string,
  token: string,
  path: string,
  query: null,
  body: object & { length?: never }
) => Promise<any>
