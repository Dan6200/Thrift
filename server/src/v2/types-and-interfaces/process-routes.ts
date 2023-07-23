import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { QueryResult, QueryResultRow } from 'pg'
import { ParsedQs } from 'qs'
import { RequestWithPayload } from './request.js'
import { ResponseData } from './response.js'
const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes

export type Status =
  | typeof CREATED
  | typeof OK
  | typeof NO_CONTENT
  | typeof NOT_FOUND

export type ProcessRouteWithoutBody = <T>(
  CRUDQuery: (queryData: {
    userId?: string
    body?: Record<string, T>
    params?: Record<string, string>
    query?: ParsedQs
  }) => Promise<Record<string, T>>,
  status: Status,
  validateBody: undefined,
  validateResult: (result: Record<string, T>) => Promise<ResponseData>
) => (
  request: RequestWithPayload,
  response: Response
) => Promise<Response<T, Record<string, T>>>

export type ProcessRouteWithNoDBResult = <T>(
  CRUDQuery: (queryData: {
    userId?: string
    body?: Record<string, T>
    params?: Record<string, string>
    query?: ParsedQs
  }) => Promise<Record<string, T>>,
  status: Status,
  validateResult: undefined,
  validateBody: <T>(reqBody: T) => Promise<void>
) => (
  request: RequestWithPayload,
  response: Response
) => Promise<Response<T, Record<string, T>>>

export type ProcessRouteWithoutBodyAndDBResult = <T>(
  CRUDQuery: (queryData: {
    userId?: string
    body?: Record<string, T>
    params?: Record<string, string>
    query?: ParsedQs
  }) => Promise<Record<string, T>>,
  status: Status,
  validateResult: undefined,
  validateBody: undefined
) => (
  request: RequestWithPayload,
  response: Response
) => Promise<Response<T, Record<string, T>>>

export type ProcessRouteWithBodyAndDBResult = <T>(
  CRUDQuery: (queryData: {
    userId?: string
    body?: Record<string, T>
    params?: Record<string, string>
    query?: ParsedQs
  }) => Promise<Record<string, T>>,
  status: Status,
  validateBody: <T>(reqBody: T) => Promise<void>,
  validateResult: <T>(result: Record<string, T>) => Promise<ResponseData>
) => (
  request: RequestWithPayload,
  response: Response
) => Promise<Response<T, Record<string, T>>>
