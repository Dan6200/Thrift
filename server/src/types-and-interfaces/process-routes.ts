import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { QueryResult } from 'pg'
import { RequestWithPayload } from './request.js'
import { ResponseData } from './response.js'
const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes

export type ReqData = {
	userId: string
}

export type ReqDataWithQueryParams = {
	userId: string
	query: object
}

export type ReqDataWithoutBody = {
	userId: string
	query: object
	params: object
}

export type ReqDataPublic = object

export type ReqDataPublicWithQueryParams = {
	userId: undefined
	query: object
}

export type ReqDataPublicWithoutBody = {
	userId: undefined
	query: object
	params: object
}

export type Status =
	| typeof CREATED
	| typeof OK
	| typeof NO_CONTENT
	| typeof NOT_FOUND

export type ProcessRouteWithoutBody = (
	dbQuery: (reqData: ReqDataPublic) => Promise<QueryResult<any>>,
	status: Status,
	validateBody: undefined,
	validateResult: (data: any) => ResponseData
) => (
	request: RequestWithPayload,
	response: Response
) => Promise<Response<any, Record<string, any>>>

export type ProcessRouteWithNoDBResult = (
	dbQuery: (reqData: ReqDataPublic) => Promise<QueryResult<any>>,
	status: Status,
	validateBody: (data: any) => object,
	validateResult: undefined
) => (
	request: RequestWithPayload,
	response: Response
) => Promise<Response<any, Record<string, any>>>
