import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ParsedQs } from 'qs'
import { RequestWithPayload } from './request.js'
import { ResponseData } from './response.js'
const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes

export type Status =
  | typeof CREATED
  | typeof OK
  | typeof NO_CONTENT
  | typeof NOT_FOUND

export type ProcessRouteWithoutBody = <T>({
  Query,
  status,
  validateResult,
}: {
  Query: (queryData: {
    userId?: string
    body?: Record<string, T>
    params?: Record<string, string>
    query?: ParsedQs
  }) => Promise<Record<string, T>>
  status: Status
  validateBody: undefined
  validateResult: (result: Record<string, T>) => Promise<void>
}) => (
  request: RequestWithPayload,
  response: Response
) => Promise<Response<T, Record<string, T>>>

export type ProcessRouteWithNoDBResult = <T>({
  Query,
  status,
  validateBody,
}: {
  Query: (queryData: {
    userId?: string
    body?: Record<string, T>
    params?: Record<string, string>
    query?: ParsedQs
  }) => Promise<Record<string, T>>
  status: Status
  validateResult: undefined
  validateBody: <T>(reqBody: T) => Promise<void>
}) => (
  request: RequestWithPayload,
  response: Response
) => Promise<Response<T, Record<string, T>>>

export type ProcessRouteWithoutBodyAndDBResult = <T>({
  Query,
  status,
}: {
  Query: (queryData: {
    userId?: string
    body?: Record<string, T>
    params?: Record<string, string>
    query?: ParsedQs
  }) => Promise<Record<string, T>>
  status: Status
  validateResult: undefined
  validateBody: undefined
}) => (
  request: RequestWithPayload,
  response: Response
) => Promise<Response<T, Record<string, T>>>

export type ProcessRouteWithBodyAndDBResult = <T>({
  Query,
  status,
  validateBody,
  validateResult,
}: {
  Query: (queryData: {
    userId?: string
    body?: Record<string, T>
    params?: Record<string, string>
    query?: ParsedQs
  }) => Promise<Record<string, T>>
  status: Status
  validateBody: <T>(reqBody: T) => Promise<void>
  validateResult: (result: Record<string, T>) => Promise<void>
}) => (
  request: RequestWithPayload,
  response: Response
) => Promise<Response<T, Record<string, T>>>
