import { Express } from "express";
import { StatusCodes } from "http-status-codes";
import path from "path";
const filename = path.basename(__filename);

interface routeProcessorParams {
  verb: string;
  path: string;
  statusCode: StatusCodes;
  dataList?: object[];
  checks?: (response: any) => void;
  parameter?: string;
}

export default function ({
  verb,
  path,
  dataList,
  statusCode,
  checks,
}: routeProcessorParams) {
  return async function (serverAgent: ChaiHttp.Agent): Promise<any> {
    const response = await serverAgent[verb](path);
    response.should.have.status(statusCode);
    // Check the data in the body if accurate
    checks && checks(response.body);
  };
}
