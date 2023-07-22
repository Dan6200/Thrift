import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import { testRouteNoData } from '../../../../types-and-interfaces/test-routes.js'
import testRoute from '../test-route.js'
chai.use(chaiHttp).should()

const routeParams = {
	statusCode: StatusCodes.NO_CONTENT,
}

const testCreateVendor = testRoute({
	verb: 'post',
	...routeParams,
	statusCode: StatusCodes.CREATED,
}) as testRouteNoData

const testGetVendor = testRoute({
	...routeParams,
	verb: 'get',
}) as testRouteNoData

const testDeleteVendor = testRoute({
	...routeParams,
	verb: 'delete',
}) as testRouteNoData

const testGetNonExistentVendor = <testRouteNoData>testRoute({
	...routeParams,
	verb: 'get',
	statusCode: StatusCodes.NOT_FOUND,
})

export {
	testCreateVendor,
	testGetVendor,
	testDeleteVendor,
	testGetNonExistentVendor,
}
