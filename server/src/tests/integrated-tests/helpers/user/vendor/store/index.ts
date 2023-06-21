import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { StoreSchemaDB } from '../../../../../../app-schema/vendor/store.js'
import {
	testRouteWithData,
	testRouteNoData,
} from '../../../../../../types-and-interfaces/test-routes.js'
import testRoute from '../../../test-route.js'

const { CREATED, OK, NOT_FOUND, NO_CONTENT } = StatusCodes

let checkId = (data: any) => {
	data.should.have.property('store_id')
	data.store_id.should.be.a('string')
}

let validateResultList = (data: any) => {
	let storeInfoList = data
	storeInfoList.should.be.an('array')
	for (let storeInfo of storeInfoList) Joi.assert(storeInfo, StoreSchemaDB)
}

let validateResult = (data: any) => {
	let storeInfo = data
	storeInfo.should.be.an('object')
	Joi.assert(storeInfo, StoreSchemaDB)
}

const routeParams = {
	statusCode: OK,
}

const testCreateStore = testRoute({
	...routeParams,
	verb: 'post',
	statusCode: CREATED,
	checks: checkId,
}) as testRouteWithData

const testGetAllStore = <testRouteNoData>testRoute({
	...routeParams,
	verb: 'get',
	checks: validateResultList,
})

const testGetStore = <testRouteNoData>testRoute({
	...routeParams,
	verb: 'get',
	checks: validateResult,
})

const testUpdateStore = <testRouteWithData>testRoute({
	...routeParams,
	verb: 'patch',
})

const testDeleteStore = <testRouteNoData>testRoute({
	...routeParams,
	verb: 'delete',
	statusCode: NO_CONTENT,
})

const testGetNonExistentStore = <testRouteNoData>testRoute({
	...routeParams,
	verb: 'get',
	statusCode: NOT_FOUND,
})

export {
	testCreateStore,
	testGetAllStore,
	testGetStore,
	testUpdateStore,
	testDeleteStore,
	testGetNonExistentStore,
}
