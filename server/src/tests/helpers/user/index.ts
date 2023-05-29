import chai from "chai";
import chaiHttp from "chai-http";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import testProcessRoute from "../test-process-route";
import { UserDataSchemaDB } from "../../../app-schema/users";

chai.use(chaiHttp).should();

const { OK, NOT_FOUND, NO_CONTENT, UNAUTHORIZED } = StatusCodes;

let validateResult = (data: any) => {
  let userInfo = data;
  userInfo.should.be.an("object");
  Joi.assert(userInfo, UserDataSchemaDB);
};

const routeParams = {};

const testDontGetUser = testProcessRoute({
  verb: "get",
  statusCode: UNAUTHORIZED,
  path: "/api/v1/user",
});

const testGetUser = testProcessRoute({
  verb: "get",
  statusCode: OK,
  checks: validateResult,
  path: "/api/v1/user",
});

const testUpdateUser = testProcessRoute({
  verb: "patch",
  statusCode: OK,
  checks: validateResult,
  path: "/api/v1/user",
});

const testChangeUserPassword = testProcessRoute({
  verb: "patch",
  statusCode: NO_CONTENT,
  path: "/api/v1/user/password",
});

const testDeleteUser = testProcessRoute({
  verb: "delete",
  statusCode: NO_CONTENT,
  path: "/api/v1/user",
});

const testGetNonExistentUser = testProcessRoute({
  verb: "get",
  statusCode: NOT_FOUND,
  path: "/api/v1/user",
});

export {
  testGetUser,
  testDontGetUser,
  testUpdateUser,
  testChangeUserPassword,
  testDeleteUser,
  testGetNonExistentUser,
};
