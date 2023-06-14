import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import { log } from "node:console";
import { readFileSync } from "node:fs";
import path from "node:path";
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

let validateResultList = (data: any) => {
  validateResult(data[0]);
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

const testGetAllProducts = <testRouteNoData>testRoute({
  ...routeParams,
  verb: "get",
  checks: validateResultList,
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

const testUploadProductMedia = async function (
  serverAgent: ChaiHttp.Agent,
  urlPath: string,
  files: any[]
): Promise<any> {
  const fieldName = "product-media";
  const request = serverAgent.post(urlPath);
  request.field("description", files[0].description);
  files.forEach((file) => {
    request.attach(
      fieldName,
      readFileSync(file.path),
      path.basename(file.path)
    );
  });
  const response = await request;

  response.should.have.status(CREATED);
  // Check the data in the body if accurate
  response.body.should.be.an("array");
  response.body[0].should.be.an("object");
  const responseObject = response.body[0];
  responseObject.should.have.property("filename");
};

export {
  testCreateProduct,
  testGetAllProducts,
  testGetProduct,
  testUpdateProduct,
  testDeleteProduct,
  testGetNonExistentProduct,
  testUploadProductMedia,
};
