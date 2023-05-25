import chai from "chai";
import chaiHttp from "chai-http";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import testProcessRoute from "../test-process-route";
import { UserDataSchemaDB } from "../../../app-schema/users";
import {
  updateUser,
  updateUserPassword,
} from "../../integrated-tests/user-data";

chai.use(chaiHttp).should();

const { OK, NOT_FOUND, NO_CONTENT, UNAUTHORIZED } = StatusCodes;

let validateResult = (data: any) => {
  let userInfo = data;
  userInfo.should.be.an("object");
  Joi.assert(userInfo, UserDataSchemaDB);
};

const routeParams = {
  path: "/api/v1/user",
};

const testDontGetUser = testProcessRoute({
  verb: "get",
  statusCode: UNAUTHORIZED,
  ...routeParams,
});

const testGetUser = testProcessRoute({
  verb: "get",
  statusCode: OK,
  checks: validateResult,
  ...routeParams,
});

const testUpdateUser = testProcessRoute({
  verb: "patch",
  statusCode: OK,
  dataList: updateUser,
  checks: validateResult,
  ...routeParams,
});

const testChangeUserPassword = testProcessRoute({
  verb: "patch",
  statusCode: NO_CONTENT,
  dataList: updateUserPassword,
  ...routeParams,
});

const testDeleteUser = testProcessRoute({
  verb: "delete",
  statusCode: OK,
  ...routeParams,
});

const testGetNonExistentUser = testProcessRoute({
  verb: "get",
  statusCode: NOT_FOUND,
  ...routeParams,
});

export {
  testGetUser,
  testDontGetUser,
  testUpdateUser,
  testChangeUserPassword,
  testDeleteUser,
  testGetNonExistentUser,
};
