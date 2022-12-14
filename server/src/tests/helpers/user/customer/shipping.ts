import application from 'application';
import testProcessRoute from 'tests/helpers/test-process-route';
import { StatusCodes } from 'http-status-codes';
import {
	newShippingData,
	updateShippingData,
} from 'tests/accounts/user/customer-account/shipping-data';
import path from 'path';
import { ShippingInfoSchemaDB } from 'app-schema/customer/shipping';
import Joi from 'joi';
const filename = path.basename(__filename);

const { CREATED, OK, NOT_FOUND, NO_CONTENT } = StatusCodes;

let checkId = (data: any) => {
	data.should.have.property('address_id');
	data.address_id.should.be.a('string');
};

let validateResultList = (data: any) => {
	let shippingInfoList = data;
	shippingInfoList.should.be.an('array');
	for (let shippingInfo of shippingInfoList)
		Joi.assert(shippingInfo, ShippingInfoSchemaDB);
};

let validateResult = (data: any) => {
	let shippingInfo = data;
	shippingInfo.should.be.an('object');
	Joi.assert(shippingInfo, ShippingInfoSchemaDB);
};

const routeParams = {
	server: application,
	parameter: 'addressIds',
	baseUrl: `/api/v1/user/customer/shipping-info`,
	statusCode: OK,
};

const testCreateShipping = testProcessRoute({
	...routeParams,
	verb: 'post',
	statusCode: CREATED,
	dataMatrix: newShippingData,
	checks: checkId,
});

const testGetAllShipping = testProcessRoute({
	...routeParams,
	verb: 'get',
	checks: validateResultList,
});

const testGetShipping = testProcessRoute({
	...routeParams,
	verb: 'get',
	checks: validateResult,
});

const testUpdateShipping = testProcessRoute({
	...routeParams,
	verb: 'put',
	dataMatrix: updateShippingData,
});

const testDeleteShipping = testProcessRoute({
	...routeParams,
	verb: 'delete',
	statusCode: NO_CONTENT,
});

const testGetNonExistentShipping = testProcessRoute({
	...routeParams,
	verb: 'get',
	statusCode: NOT_FOUND,
});

export {
	testCreateShipping,
	testGetAllShipping,
	testGetShipping,
	testUpdateShipping,
	testDeleteShipping,
	testGetNonExistentShipping,
};
