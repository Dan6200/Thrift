import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { QueryResult } from 'pg'
import { RequestWithPayload } from './request.js'
import { ResponseData } from './response.js'
const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes

export type QueryResultPromise = Promise<QueryResult<any>>
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
	userId,
}: {
	userId: string
}) => QueryResultPromise

export type CRUDQueryAuthWithQueryParams = ({
	userId,
	query,
}: {
	userId: string
	query: object
}) => QueryResultPromise

export type CRUDQueryAuthWithRouteParams = ({
	userId,
	params,
}: {
	userId: string
	params: object
}) => QueryResultPromise

export type CRUDQueryAuthWithQueryAndRouteParams = ({
	userId,
	query,
	params,
}: {
	userId: string
	query: object
	params: object
}) => QueryResultPromise

export type Status =
	| typeof CREATED
	| typeof OK
	| typeof NO_CONTENT
	| typeof NOT_FOUND

export type QueryData = {
	userId?: string
	query?: object
	params?: object
	reqBody?: object
}

export type ProcessRouteWithoutBody = (
	CRUDQuery: (queryData: QueryData) => QueryResultPromise,
	status: Status,
	validateResult: (result: QueryResult<any>) => ResponseData
) => (
	request: RequestWithPayload,
	response: Response
) => Promise<Response<any, Record<string, any>>>

export type ProcessRouteWithNoDBResult = (
	CRUDQuery: (queryData: QueryData) => QueryResultPromise,
	status: Status,
	validateBody: (reqBody: any) => object
) => (
	request: RequestWithPayload,
	response: Response
) => Promise<Response<any, Record<string, any>>>

export type ProcessRouteWithoutBodyAndDBResult = (
	CRUDQuery: (queryData: object) => QueryResultPromise,
	status: Status
) => (
	request: RequestWithPayload,
	response: Response
) => Promise<Response<any, Record<string, any>>>

export type ProcessRouteWithBodyAndDBResult = (
	CRUDQuery: (queryData: object) => QueryResultPromise,
	status: Status,
	validateBody: (reqBody: any) => object,
	validateResult: (result: QueryResult<any>) => ResponseData
) => (
	request: RequestWithPayload,
	response: Response
) => Promise<Response<any, Record<string, any>>>
