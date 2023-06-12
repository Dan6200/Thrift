import chai from "chai";
import chaiHttp from "chai-http";
import { StatusCodes } from "http-status-codes";
import { testRouteNoData } from "../../../../types-and-interfaces/test-routes.js";
import testRoute from "../../test-route.js";
chai.use(chaiHttp).should();

const routeParams = {
  path: "/v1/user/vendor",
};

const testCreateVendor = testRoute({
  verb: "post",
  statusCode: StatusCodes.CREATED,
  ...routeParams,
}) as testRouteNoData;

const testGetVendor = testRoute({
  ...routeParams,
  verb: "get",
  statusCode: StatusCodes.OK,
}) as testRouteNoData;

const testDeleteVendor = testRoute({
  ...routeParams,
  verb: "delete",
  statusCode: StatusCodes.NO_CONTENT,
}) as testRouteNoData;

const testGetNonExistentVendor = <testRouteNoData>testRoute({
  ...routeParams,
  verb: "get",
  statusCode: StatusCodes.NOT_FOUND,
});

export {
  testCreateVendor,
  testGetVendor,
  testDeleteVendor,
  testGetNonExistentVendor,
};
