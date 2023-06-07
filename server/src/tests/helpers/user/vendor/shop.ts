import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import { ShopSchemaDB } from "../../../../app-schema/vendor/shop.js";
import testRoute from "../../test-route.js";

const { CREATED, OK, NOT_FOUND, NO_CONTENT } = StatusCodes;

let checkId = (data: any) => {
  data.should.have.property("shop_id");
  data.shop_id.should.be.a("string");
};

let validateResultList = (data: any) => {
  let shopInfoList = data;
  shopInfoList.should.be.an("array");
  for (let shopInfo of shopInfoList) Joi.assert(shopInfo, ShopSchemaDB);
};

let validateResult = (data: any) => {
  let shopInfo = data;
  shopInfo.should.be.an("object");
  Joi.assert(shopInfo, ShopSchemaDB);
};

const routeParams = {
  path: `/api/v1/user/vendor/shops`,
  statusCode: OK,
};

const testCreateShop = testRoute({
  ...routeParams,
  verb: "post",
  statusCode: CREATED,
  checks: checkId,
});

const testGetAllShop = testRoute({
  ...routeParams,
  verb: "get",
  checks: validateResultList,
});

const testGetShop = testRoute({
  ...routeParams,
  verb: "get",
  checks: validateResult,
});

const testUpdateShop = testRoute({
  ...routeParams,
  verb: "put",
});

const testDeleteShop = testRoute({
  ...routeParams,
  verb: "delete",
  statusCode: NO_CONTENT,
});

const testGetNonExistentShop = testRoute({
  ...routeParams,
  verb: "get",
  statusCode: NOT_FOUND,
});

export {
  testCreateShop,
  testGetAllShop,
  testGetShop,
  testUpdateShop,
  testDeleteShop,
  testGetNonExistentShop,
};
