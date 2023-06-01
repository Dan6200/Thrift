import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import { ShippingInfoSchemaDB } from "../../../../app-schema/customer/shipping";
import {
  testRouteWithAgent,
  testRouteWithAgentAndData,
  testRouteWithAgentAndParams,
  testRouteWithAgentDataAndParams,
} from "../../../../types-and-interfaces/test-routes";
import testRoute from "../../test-route";

const { CREATED, OK, NOT_FOUND, NO_CONTENT } = StatusCodes;

let checkId = (data: any) => {
  data.should.have.property("address_id");
  data.address_id.should.be.a("string");
};

let validateResultList = (data: any) => {
  let shippingInfoList = data;
  shippingInfoList.should.be.an("array");
  for (let shippingInfo of shippingInfoList) validateResult(shippingInfo);
};

let validateResult = (data: any) => {
  let shippingInfo = data;
  shippingInfo.should.be.an("object");
  Joi.assert(shippingInfo, ShippingInfoSchemaDB);
};

const routeParams = {
  path: `/api/v1/user/customer/shipping-info`,
  statusCode: OK,
};

const testCreateShipping = testRoute({
  ...routeParams,
  verb: "post",
  statusCode: CREATED,
  checks: checkId,
}) as testRouteWithAgentAndData;

const testGetAllShipping = testRoute({
  ...routeParams,
  verb: "get",
  checks: validateResultList,
}) as testRouteWithAgent;

const testGetShipping = testRoute({
  ...routeParams,
  verb: "get",
  checks: validateResult,
}) as testRouteWithAgentAndParams;

const testUpdateShipping = testRoute({
  ...routeParams,
  verb: "patch",
}) as testRouteWithAgentDataAndParams;

const testDeleteShipping = testRoute({
  ...routeParams,
  verb: "delete",
  statusCode: NO_CONTENT,
}) as testRouteWithAgentAndParams;

const testGetNonExistentShipping = testRoute({
  ...routeParams,
  verb: "get",
  statusCode: NOT_FOUND,
}) as testRouteWithAgentAndParams;

export {
  testCreateShipping,
  testGetAllShipping,
  testGetShipping,
  testUpdateShipping,
  testDeleteShipping,
  testGetNonExistentShipping,
};
