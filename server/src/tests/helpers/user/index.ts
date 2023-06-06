import chai from "chai";
import chaiHttp from "chai-http";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import { UserDataSchemaDB } from "../../../app-schema/users.js";
import {
  testRouteWithAgent,
  testRouteWithAgentAndData,
} from "../../../types-and-interfaces/test-routes.js";
import testRoute from "../test-route.js";

chai.use(chaiHttp).should();

const { OK, NOT_FOUND, NO_CONTENT, UNAUTHORIZED } = StatusCodes;

let validateResult = (data: any) => {
  let userInfo = data;
  userInfo.should.be.an("object");
  Joi.assert(userInfo, UserDataSchemaDB);
};

const routeParams = {};

const testDontGetUser = testRoute({
  verb: "get",
  statusCode: UNAUTHORIZED,
  path: "/api/v1/user",
}) as testRouteWithAgent;

const testGetUser = testRoute({
  verb: "get",
  statusCode: OK,
  checks: validateResult,
  path: "/api/v1/user",
}) as testRouteWithAgent;

const testUpdateUser = testRoute({
  verb: "patch",
  statusCode: OK,
  checks: validateResult,
  path: "/api/v1/user",
}) as testRouteWithAgentAndData;

const testChangeUserPassword = testRoute({
  verb: "patch",
  statusCode: NO_CONTENT,
  path: "/api/v1/user/password",
}) as testRouteWithAgentAndData;

const testDeleteUser = testRoute({
  verb: "delete",
  statusCode: NO_CONTENT,
  path: "/api/v1/user",
}) as testRouteWithAgent;

const testGetNonExistentUser = testRoute({
  verb: "get",
  statusCode: NOT_FOUND,
  path: "/api/v1/user",
}) as testRouteWithAgent;

export {
  testGetUser,
  testDontGetUser,
  testUpdateUser,
  testChangeUserPassword,
  testDeleteUser,
  testGetNonExistentUser,
};
