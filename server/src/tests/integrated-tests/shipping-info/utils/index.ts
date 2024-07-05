import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { ShippingInfoResponseSchema } from '../../../../app-schema/shipping.js'
import {
  isValidShippingInfoId,
  isValidShippingInfoRequest,
  isValidShippingInfoResponse,
  isValidShippingInfoResponseList,
} from '../../../../types-and-interfaces/shipping-info.js'
import {
  TestCreateRequest,
  TestCreateRequestWithBody,
} from '../../../../types-and-interfaces/test-routes.js'
import testRoute from '../../test-route/index.js'

const { CREATED, OK, NOT_FOUND } = StatusCodes

const routeParams = {
  path: `/v1/users/customers/shipping-info`,
  statusCode: OK,
}

const testCreateShipping = (testRoute as TestCreateRequestWithBody)({
  ...routeParams,
  verb: 'post',
  statusCode: CREATED,
  validateReqData: isValidShippingInfoRequest,
  validateResData: isValidShippingInfoId,
})

const testGetAllShipping = (testRoute as TestCreateRequest)({
  ...routeParams,
  verb: 'get',
  validateResData: isValidShippingInfoResponseList,
})

const testGetShipping = (testRoute as TestCreateRequest)({
  ...routeParams,
  verb: 'get',
  validateResData: isValidShippingInfoResponse,
})

const testUpdateShipping = (testRoute as TestCreateRequestWithBody)({
  ...routeParams,
  verb: 'put',
  validateReqData: isValidShippingInfoRequest,
  validateResData: isValidShippingInfoId,
})

const testDeleteShipping = (testRoute as TestCreateRequest)({
  ...routeParams,
  verb: 'delete',
  validateResData: isValidShippingInfoId,
})

const testGetNonExistentShipping = (testRoute as TestCreateRequest)({
  ...routeParams,
  verb: 'get',
  statusCode: NOT_FOUND,
  validateResData: isValidShippingInfoResponse,
})

export {
  testCreateShipping,
  testGetAllShipping,
  testGetShipping,
  testUpdateShipping,
  testDeleteShipping,
  testGetNonExistentShipping,
}
