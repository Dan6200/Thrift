import chai from "chai";
import chaiHttp from "chai-http";
import { StatusCodes } from "http-status-codes";
import { testRouteWithAgent } from "../../../../types-and-interfaces/test-routes";
import testRoute from "../../test-route";

chai.use(chaiHttp).should();

const routeParams = {
  path: "/api/v1/user/customer",
};

const testCreateCustomer = testRoute({
  ...routeParams,
  verb: "post",
  statusCode: StatusCodes.CREATED,
}) as testRouteWithAgent;

const testGetCustomer = testRoute({
  ...routeParams,
  verb: "get",
  statusCode: StatusCodes.OK,
}) as testRouteWithAgent;

const testUpdateCustomer = testRoute({
  ...routeParams,
  verb: "patch",
  statusCode: StatusCodes.OK,
}) as testRouteWithAgent;

const testDeleteCustomer = testRoute({
  ...routeParams,
  verb: "delete",
  statusCode: StatusCodes.NO_CONTENT,
}) as testRouteWithAgent;

const testGetNonExistentCustomer = testRoute({
  ...routeParams,
  verb: "get",
  statusCode: StatusCodes.NOT_FOUND,
}) as testRouteWithAgent;

export {
  testCreateCustomer,
  testGetCustomer,
  testUpdateCustomer,
  testDeleteCustomer,
  testGetNonExistentCustomer,
};
