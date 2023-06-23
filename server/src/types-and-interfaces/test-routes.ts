import { StatusCodes } from 'http-status-codes'

interface testRouteParams {
	verb: string
	statusCode: StatusCodes
	checks?: (response: any) => Promise<void>
}
type testRouteNoData = (agent: ChaiHttp.Agent, path: string) => Promise<any>

type testRouteWithData = (
	agent: ChaiHttp.Agent,
	path: string,
	data: Object & { length?: never }
) => Promise<any>

export { testRouteParams, testRouteNoData, testRouteWithData }
