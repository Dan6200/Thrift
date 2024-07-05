import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { ShippingInfoSchemaDB } from '../../../../app-schema/shipping.js'
import { TestCreateRequest } from '../../../../types-and-interfaces/test-routes.js'
import testRoute from '../../test-route/index.js'

const { CREATED, OK, NOT_FOUND } = StatusCodes

let checkId = async (data: any) => {
  data.should.have.property('shipping_info_id')
  data.shipping_info_id.should.be.a('number')
}

let validateResultList = async (data: any) => {
  let shippingInfoList = data
  shippingInfoList.should.be.an('array')
  for (let shippingInfo of shippingInfoList) validateResult(shippingInfo)
}

let validateResult = async (data: any) => {
  let shippingInfo = data
  shippingInfo.should.be.an('object')
  Joi.assert(shippingInfo, ShippingInfoSchemaDB)
}

const routeParams = {
  path: `/v1/user/customer/shipping-info`,
  statusCode: OK,
}

const testCreateShipping = (testRoute as TestCreateRequest)({
  ...routeParams,
  verb: 'post',
  statusCode: CREATED,
  checks: checkId,
})

const testGetAllShipping = (testRoute as TestCreateRequest)({
  ...routeParams,
  verb: 'get',
  checks: validateResultList,
})

const testGetShipping = (testRoute as TestCreateRequest)({
  ...routeParams,
  verb: 'get',
  checks: validateResult,
})

const testUpdateShipping = (testRoute as TestCreateRequest)({
  ...routeParams,
  verb: 'put',
  checks: checkId,
})

const testDeleteShipping = (testRoute as TestCreateRequest)({
  ...routeParams,
  verb: 'delete',
  checks: checkId,
})

const testGetNonExistentShipping = (testRoute as TestCreateRequest)({
  ...routeParams,
  verb: 'get',
  statusCode: NOT_FOUND,
})

export {
  testCreateShipping,
  testGetAllShipping,
  testGetShipping,
  testUpdateShipping,
  testDeleteShipping,
  testGetNonExistentShipping,
}
