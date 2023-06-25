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

type testRouteWithData = (
	server: string,
	token: string,
	path: string,
	data: Object & { length?: never }
) => Promise<any>

export { testRouteParams, testRouteNoData, testRouteWithData }
