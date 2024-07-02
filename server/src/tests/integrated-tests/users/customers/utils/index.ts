import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import { TestCreateRequest } from '../../../../../types-and-interfaces/test-routes.js'
import testRoute from '../../../test-route/index.js'

chai.use(chaiHttp).should()

const routeParams = {
  path: '/v1/users/customer',
}

const testPostCustomer = testRoute({
  ...routeParams,
  verb: 'post',
  statusCode: StatusCodes.CREATED,
})

const testDeleteCustomer = testRoute({
  ...routeParams,
  verb: 'delete',
  statusCode: StatusCodes.NO_CONTENT,
})

export { testPostCustomer, testDeleteCustomer }
