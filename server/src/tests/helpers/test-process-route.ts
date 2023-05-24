import { Express } from "express";
import { StatusCodes } from "http-status-codes";
import path from "path";
import chaiRequest from "./chai-request";
const filename = path.basename(__filename);

interface routeProcessorParams {
  server: string | Express;
  verb: string;
  baseUrl: string;
  statusCode: StatusCodes;
  dataList?: object[];
  checks?: (response: any) => void;
  parameter?: string;
}

export default function ({
  server,
  verb,
  baseUrl,
  dataList,
  statusCode,
  checks,
}: routeProcessorParams) {
  return async function (param?: string): Promise<any> {};
}
