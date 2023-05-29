import { StatusCodes } from "http-status-codes";

interface routeProcessorParams {
  verb: string;
  path: string;
  statusCode: StatusCodes;
  checks?: (response: any) => void;
}

export default function ({
  verb,
  path,
  statusCode,
  checks,
}: routeProcessorParams) {
  return async function (
    serverAgent: ChaiHttp.Agent,
    data?: object | null,
    params: string = ""
  ): Promise<any> {
    const response = await serverAgent[verb](`${path}/${params}`).send(data);
    response.should.have.status(statusCode);
    // Check the data in the body if accurate
    checks && checks(response.body);
    return response.body;
  };
}
