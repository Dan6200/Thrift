import { StatusCodes } from "http-status-codes";

interface testRouteParams {
  verb: string;
  statusCode: StatusCodes;
  checks?: (response: any) => void;
}
type testRouteWithAgent = (agent: ChaiHttp.Agent) => Promise<any>;

type testRouteWithAgentAndData = (
  agent: ChaiHttp.Agent,
  params: string,
  data: object
) => Promise<any>;

type testRouteWithAgentAndParams = (
  agent: ChaiHttp.Agent,
  data: null
) => Promise<any>;

type testRouteWithAgentDataAndParams = (
  agent: ChaiHttp.Agent,
  data: object,
  params: string
) => Promise<any>;

export {
  testRouteParams,
  testRouteWithAgent,
  testRouteWithAgentAndData,
  testRouteWithAgentAndParams,
  testRouteWithAgentDataAndParams,
};
