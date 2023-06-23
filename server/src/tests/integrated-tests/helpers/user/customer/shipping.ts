import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { ShippingInfoSchemaDB } from '../../../../../app-schema/customer/shipping.js'
import {
	testRouteWithData,
	testRouteNoData,
} from '../../../../../types-and-interfaces/test-routes.js'
import testRoute from '../../test-route.js'
const { CREATED, OK, NOT_FOUND, NO_CONTENT } = StatusCodes

let checkId = async (data: any) => {
	data.should.have.property('address_id')
	data.address_id.should.be.a('string')
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

const testCreateShipping = testRoute({
	...routeParams,
	verb: 'post',
	statusCode: CREATED,
	checks: checkId,
}) as testRouteWithData

const testGetAllShipping = testRoute({
	...routeParams,
	verb: 'get',
	checks: validateResultList,
}) as testRouteNoData

const testGetShipping = testRoute({
	...routeParams,
	verb: 'get',
	checks: validateResult,
}) as testRouteNoData

const testUpdateShipping = testRoute({
	...routeParams,
	verb: 'put',
}) as testRouteWithData

const testDeleteShipping = testRoute({
	...routeParams,
	verb: 'delete',
	statusCode: NO_CONTENT,
}) as testRouteNoData

const testGetNonExistentShipping = testRoute({
	...routeParams,
	verb: 'get',
	statusCode: NOT_FOUND,
}) as testRouteNoData

export {
	testCreateShipping,
	testGetAllShipping,
	testGetShipping,
	testUpdateShipping,
	testDeleteShipping,
	testGetNonExistentShipping,
}
