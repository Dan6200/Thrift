import { StatusCodes } from "http-status-codes";
// const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes;
// type Status = typeof CREATED | typeof OK | typeof NO_CONTENT | typeof NOT_FOUND;

// type ResponseData = {
//   status: Status;
//   data?: string | object;
// };

interface testRouteParams {
  verb: string;
  path: string;
  statusCode: StatusCodes;
  checks?: (response: any) => void;
}
type testRouteWithAgent = (agent: ChaiHttp.Agent) => Promise<any>;

type testRouteWithAgentAndData = (
  agent: ChaiHttp.Agent,
  data: object
) => Promise<any>;

type testRouteWithAgentAndParams = (
  agent: ChaiHttp.Agent,
  data: null,
  params: string
) => Promise<any>;

type testRouteWithAgentDataAndParams = (
  agent: ChaiHttp.Agent,
  data: object,
  params: string
) => Promise<any>;

export {
  Status,
  ResponseData,
  routeProcessorParams,
  testRouteWithAgent,
  testRouteWithAgentAndData,
  testRouteWithAgentAndParams,
  testRouteWithAgentDataAndParams,
};
