import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import { ProductSchemaDB } from "../../../../../../app-schema/products.js";
import {
  testRouteNoData,
  testRouteWithData,
} from "../../../../../../types-and-interfaces/test-routes.js";
import testRoute from "../../../../test-route.js";

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
  statusCode: OK,
};

const testCreateProduct = <testRouteWithData>testRoute({
  ...routeParams,
  verb: "post",
  statusCode: CREATED,
  checks: checkId,
});

const testGetAllProduct = <testRouteNoData>testRoute({
  ...routeParams,
  verb: "get",
  checks: validateResult,
});

const testGetProduct = <testRouteNoData>testRoute({
  ...routeParams,
  verb: "get",
  checks: validateResult,
});

const testUpdateProduct = <testRouteWithData>testRoute({
  ...routeParams,
  verb: "patch",
});

const testDeleteProduct = <testRouteNoData>testRoute({
  ...routeParams,
  verb: "delete",
});

const testGetNonExistentProduct = <testRouteNoData>testRoute({
  ...routeParams,
  verb: "get",
  statusCode: NOT_FOUND,
});

export {
  testCreateProduct,
  testGetAllProduct,
  testGetProduct,
  testUpdateProduct,
  testDeleteProduct,
  testGetNonExistentProduct,
};
