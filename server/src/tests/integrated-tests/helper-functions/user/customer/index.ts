import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import { TestCreateRequest } from '../../../../../types-and-interfaces/test-routes.js'
import testRoute from '../../test-route.js'

chai.use(chaiHttp).should()

const routeParams = {
  path: '/v1/user/customer',
}

const testCreateCustomer = testRoute({
  ...routeParams,
  verb: 'post',
  statusCode: StatusCodes.CREATED,
})

const testUpdateCustomer = testRoute({
  ...routeParams,
  verb: 'patch',
  statusCode: StatusCodes.NO_CONTENT,
}) as TestCreateRequest

const testDeleteCustomer = testRoute({
  ...routeParams,
  verb: 'delete',
  statusCode: StatusCodes.NO_CONTENT,
}) as TestCreateRequest

const testGetNonExistentCustomer = testRoute({
  ...routeParams,
  verb: 'get',
  statusCode: StatusCodes.NOT_FOUND,
}) as TestCreateRequest

export {
  testCreateCustomer,
  testUpdateCustomer,
  testDeleteCustomer,
  testGetNonExistentCustomer,
}
