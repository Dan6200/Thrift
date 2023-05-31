import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import { ProductSchemaDB } from "../../../../app-schema/product";
import testRoute from "../../test-route";
import {
  testRouteWithAgent,
  testRouteWithAgentAndData,
  testRouteWithAgentAndParams,
  testRouteWithAgentDataAndParams,
} from "../../../../types-and-interfaces/routes-processor";

const { CREATED, OK, NOT_FOUND } = StatusCodes;

let checkId = (data: any) => {
  data.should.have.property("product_id");
  data.product_id.should.be.a("string");
};

let validateResult = (data: any) => {
  let productInfo = data;
  productInfo.should.be.an("object");
  Joi.assert(productInfo, ProductSchemaDB);
};

const routeParams = {
  path: `/api/v1/user/vendor/products`,
  statusCode: OK,
};

const testCreateProduct = testRoute({
  ...routeParams,
  verb: "post",
  statusCode: CREATED,
  checks: checkId,
}) as testRouteWithAgentAndData;

const testGetAllProduct = testRoute({
  ...routeParams,
  verb: "get",
  checks: validateResult,
}) as testRouteWithAgent;

const testGetProduct = testRoute({
  ...routeParams,
  verb: "get",
  checks: validateResult,
}) as testRouteWithAgentAndParams;

const testUpdateProduct = testRoute({
  ...routeParams,
  verb: "put",
}) as testRouteWithAgentDataAndParams;

const testDeleteProduct = testRoute({
  ...routeParams,
  verb: "delete",
}) as testRouteWithAgentAndParams;

const testGetNonExistentProduct = testRoute({
  ...routeParams,
  verb: "get",
  statusCode: NOT_FOUND,
}) as testRouteWithAgentAndParams;

export {
  testCreateProduct,
  testGetAllProduct,
  testGetProduct,
  testUpdateProduct,
  testDeleteProduct,
  testGetNonExistentProduct,
};
