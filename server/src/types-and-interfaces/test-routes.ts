import { StatusCodes } from 'http-status-codes'

interface testRouteParams {
	verb: string
	statusCode: StatusCodes
	checks?: (response: any) => Promise<void>
}
type testRouteNoData = (
	server: string,
	token: string,
	path: string
) => Promise<any>

export type testRouteWithQParams = (
	server: string,
	token: string,
	path: string,
	query: { [k: string]: any } & { length?: never }
) => Promise<any>

export type testRouteWithQParamsAndData = (
	server: string,
	token: string,
	path: string,
	query: { [k: string]: any } & { length?: never },
	data: object & { length?: never }
) => Promise<any>

type testRouteWithData = (
	server: string,
	token: string,
	path: string,
	query: null,
	data: object & { length?: never }
) => Promise<any>

export { testRouteParams, testRouteNoData, testRouteWithData }
