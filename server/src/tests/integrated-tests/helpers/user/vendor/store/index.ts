import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { QueryResult } from 'pg'
import { StoreSchemaDBResult } from '../../../../../../app-schema/vendor/store.js'
import {
	testRouteWithData,
	testRouteNoData,
} from '../../../../../../types-and-interfaces/test-routes.js'
import testRoute from '../../../test-route.js'

const { CREATED, OK, NOT_FOUND } = StatusCodes

let checkId = async (data: any) => {
	data.should.have.property('store_id')
	data.store_id.should.be.a('string')
}

let validateResultList = async (
	data: Promise<QueryResult<any>>
): Promise<void> => {
	let storeInfoList = await data
	storeInfoList.should.be.an('array')
	Joi.assert(storeInfoList, StoreSchemaDBResult)
}

let validateResult = async (data: Promise<QueryResult<any>>): Promise<void> => {
	let storeInfo = await data
	storeInfo.should.be.an('object')
	Joi.assert(storeInfo, StoreSchemaDBResult)
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
	statusCode: OK,
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
