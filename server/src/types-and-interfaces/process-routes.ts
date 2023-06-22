import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { QueryResult, QueryResultRow } from 'pg'
import { RequestWithPayload } from './request.js'
import { ResponseData } from './response.js'
const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes

export type QueryResultPromise = Promise<QueryResult<QueryResultRow>>
export type CRUDQueryPublic = ({}) => QueryResultPromise
export type CRUDQueryPublicWithQueryParams = ({
	query,
}: {
	query: object
}) => QueryResultPromise

export type CRUDQueryPublicWithRouteParams = ({
	params,
}: {
	params: object
}) => QueryResultPromise

export type CRUDQueryPublicWithQueryAndRouteParams = ({
	query,
	params,
}: {
	query: object
	params: object
}) => QueryResultPromise

export type CRUDQueryAuth = ({
	user,
}: {
	user: { userId: string }
}) => QueryResultPromise

export type CRUDQueryAuthWithQueryParams = ({
	user,
	query,
}: {
	user: { userId: string }
	query: object
}) => QueryResultPromise

export type CRUDQueryAuthWithRouteParams = ({
	user,
	params,
}: {
	user: { userId: string }
	params: object
}) => QueryResultPromise

export type CRUDQueryAuthWithQueryAndRouteParams = ({
	user,
	query,
	params,
}: {
	user: { userId: string }
	query: object
	params: object
}) => QueryResultPromise

export type Status =
	| typeof CREATED
	| typeof OK
	| typeof NO_CONTENT
	| typeof NOT_FOUND

export type ProcessRouteWithoutBody = (
	CRUDQuery: (queryData: RequestWithPayload) => QueryResultPromise,
	status: Status,
	validateResult: (result: QueryResult<QueryResultRow>) => ResponseData
) => (
	request: RequestWithPayload,
	response: Response
) => Promise<Response<any, Record<string, any>>>

export type ProcessRouteWithNoDBResult = (
	CRUDQuery: (queryData: RequestWithPayload) => QueryResultPromise,
	status: Status,
	validateBody: <T>(reqBody: T) => void
) => (
	request: RequestWithPayload,
	response: Response
) => Promise<Response<any, Record<string, any>>>

export type ProcessRouteWithoutBodyAndDBResult = (
	CRUDQuery: (queryData: RequestWithPayload) => QueryResultPromise,
	status: Status
) => (
	request: RequestWithPayload,
	response: Response
) => Promise<Response<any, Record<string, any>>>

export type ProcessRouteWithBodyAndDBResult = (
	CRUDQuery: (queryData: RequestWithPayload) => QueryResultPromise,
	status: Status,
	validateBody: <T>(reqBody: T) => void,
	validateResult: (result: QueryResult<any>) => ResponseData
) => (
	request: RequestWithPayload,
	response: Response
) => Promise<Response<any, Record<string, any>>>
