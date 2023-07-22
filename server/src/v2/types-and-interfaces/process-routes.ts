import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { QueryResult, QueryResultRow } from 'pg'
import { RequestWithPayload } from './request.js'
import { ResponseData } from './response.js'
const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes

export type QueryResultPromise = Promise<QueryResult<QueryResultRow>>
export type CRUDQueryPublic = ({}) => QueryResultPromise | Promise<void>
export type CRUDQueryPublicWithQueryParams = ({
	query,
}: {
	query: object
}) => QueryResultPromise | Promise<void>

export type CRUDQueryPublicWithRouteParams = ({
	params,
}: {
	params: object
}) => QueryResultPromise | Promise<void>

export type CRUDQueryPublicWithQueryAndRouteParams = ({
	query,
	params,
}: {
	query: object
	params: object
}) => QueryResultPromise | Promise<void>

export type CRUDQueryAuth = ({
	user,
}: {
	user: { userId: string }
}) => QueryResultPromise | Promise<void>

export type CRUDQueryAuthWithQueryParams = ({
	user,
	query,
}: {
	user: { userId: string }
	query: object
}) => QueryResultPromise | Promise<void>

export type CRUDQueryAuthWithRouteParams = ({
	user,
	params,
}: {
	user: { userId: string }
	params: object
}) => QueryResultPromise | Promise<void>

export type CRUDQueryAuthWithQueryAndRouteParams = ({
	user,
	query,
	params,
}: {
	user: { userId: string }
	query: object
	params: object
}) => QueryResultPromise | Promise<void>

export type Status =
	| typeof CREATED
	| typeof OK
	| typeof NO_CONTENT
	| typeof NOT_FOUND

export type ProcessRouteWithoutBody = (
	CRUDQuery: (
		queryData: RequestWithPayload
	) => QueryResultPromise | Promise<void>,
	status: Status,
	validateBody: undefined,
	validateResult: (result: QueryResult<QueryResultRow>) => Promise<ResponseData>
) => (
	request: RequestWithPayload,
	response: Response
) => Promise<Response<any, Record<string, any>>>

export type ProcessRouteWithNoDBResult = (
	CRUDQuery: (
		queryData: RequestWithPayload
	) => QueryResultPromise | Promise<void>,
	status: Status,
	validateResult: undefined,
	validateBody: <T>(reqBody: T) => Promise<void>
) => (
	request: RequestWithPayload,
	response: Response
) => Promise<Response<any, Record<string, any>>>

export type ProcessRouteWithoutBodyAndDBResult = (
	CRUDQuery: (
		queryData: RequestWithPayload
	) => QueryResultPromise | Promise<void>,
	status: Status,
	validateResult: undefined,
	validateBody: undefined
) => (
	request: RequestWithPayload,
	response: Response
) => Promise<Response<any, Record<string, any>>>

export type ProcessRouteWithBodyAndDBResult = (
	CRUDQuery: (
		queryData: RequestWithPayload
	) => QueryResultPromise | Promise<void>,
	status: Status,
	validateBody: <T>(reqBody: T) => Promise<void>,
	validateResult: (result: QueryResult<QueryResultRow>) => Promise<ResponseData>
) => (
	request: RequestWithPayload,
	response: Response
) => Promise<Response<any, Record<string, any>>>
