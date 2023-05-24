import { Express } from "express";
import { StatusCodes } from "http-status-codes";
import path from "path";
import chaiRequest from "./chai-request";
const filename = path.basename(__filename);

interface routeProcessorParams {
  server: string | Express;
  verb: string;
  path: string;
  statusCode: StatusCodes;
  dataList?: object[];
  checks?: (response: any) => void;
  parameter?: string;
}

export default function ({
  server,
  verb,
  path,
  dataList,
  statusCode,
  checks,
}: routeProcessorParams) {
  return async function (): Promise<any> {
    const response = await chaiRequest(server, verb, path);
    response.should.have.status(statusCode);
    checks && checks(response);
  };
}
