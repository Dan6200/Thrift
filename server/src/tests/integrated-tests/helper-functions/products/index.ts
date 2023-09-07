import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { readFile } from 'node:fs/promises'
import {
  ProductSchemaDB,
  ProductSchemaDBList,
} from '../../../../app-schema/products.js'
import { ProductMedia } from '../../../../types-and-interfaces/products.js'
import {
  testRouteWithQParams,
  testRouteWithQParamsAndData,
  testPublicRouteWithQParams,
} from '../../../../types-and-interfaces/test-routes.js'
import testRoute from '../test-route.js'

chai.use(chaiHttp).should()

const { CREATED, OK, NOT_FOUND } = StatusCodes

let checkId = async (data: any) => {
  data.should.have.property('product_id')
  data.product_id.should.be.a('number')
}

let validateResult = (schema: Joi.ObjectSchema<any>) => async (data: any) => {
  let productInfo = data
  Joi.assert(productInfo, schema)
}

const routeParams = {
  statusCode: OK,
}

const testCreateProduct = async function* (
  server: string,
  token: string,
  path: string,
  query: object,
  dataList: object[]
) {
  const range = dataList.length
  for (let idx = 0; idx < range; idx++) {
    const response = await chai
      .request(server)
      .post(path)
      .send(dataList[idx])
      .auth(token, { type: 'bearer' })
      .query(query)
    response.should.have.status(CREATED)
    // Check that the response contains the product id
    checkId(response.body)
    yield response.body
  }
}

const testGetAllProducts = <testRouteWithQParams>testRoute({
  ...routeParams,
  verb: 'get',
  checks: validateResult(ProductSchemaDBList),
})

export const testGetAllProductsPublic = <testPublicRouteWithQParams>testRoute({
  ...routeParams,
  verb: 'get',
  checks: validateResult(ProductSchemaDBList),
})

const testGetProduct = <testRouteWithQParams>testRoute({
  ...routeParams,
  verb: 'get',
  checks: validateResult(ProductSchemaDB),
})

export const testGetProductPublic = <testPublicRouteWithQParams>testRoute({
  ...routeParams,
  verb: 'get',
  checks: validateResult(ProductSchemaDB),
})

const testUpdateProduct = <testRouteWithQParamsAndData>testRoute({
  ...routeParams,
  verb: 'patch',
  checks: checkId,
})

const testDeleteProduct = <testRouteWithQParams>testRoute({
  ...routeParams,
  verb: 'delete',
})

const testGetNonExistentProduct = <testRouteWithQParams>testRoute({
  ...routeParams,
  verb: 'get',
  statusCode: NOT_FOUND,
})

const testUploadProductMedia = async function (
  server: string,
  token: string,
  urlPath: string,
  files: ProductMedia[],
  queryParams: { [k: string]: any }
): Promise<any> {
  const fieldName = 'product-media'
  const request = chai
    .request(server)
    .post(urlPath)
    .auth(token, { type: 'bearer' })
    .query(queryParams)
  await Promise.all(
    files.map(async (file) => {
      const data = await readFile(file.path)
      request.attach(fieldName, data, file.name)
    })
  )

  const descriptions = files.reduce((acc, file) => {
    acc[file.name] = file.description
    return acc
  }, {})

  const isDisplayImage = files.reduce((acc, file) => {
    acc[file.name] = file.is_display_image
    return acc
  }, {})

  const isLandingImage = files.reduce((acc, file) => {
    acc[file.name] = file.is_landing_image
    return acc
  }, {})

  const isVideo = files.reduce((acc, file) => {
    acc[file.name] = file.is_video
    return acc
  }, {})

  request.field('descriptions', JSON.stringify(descriptions))
  request.field('is_display_image', JSON.stringify(isDisplayImage))
  request.field('is_landing_image', JSON.stringify(isLandingImage))
  request.field('is_video', JSON.stringify(isVideo))

  const response = await request
  response.should.have.status(CREATED)
  // Check the data in the body if accurate
  checkMedia(response.body)
  return response.body
}

export {
  testCreateProduct,
  testGetAllProducts,
  testGetProduct,
  testUpdateProduct,
  testDeleteProduct,
  testGetNonExistentProduct,
  testUploadProductMedia,
}

async function checkMedia(body: any) {
  body.should.be.an('array')
  body[0].should.be.an('object')
  body[0].should.have.property('filename')
  body[0].should.have.property('filepath')
  body[0].should.have.property('is_display_image')
  body[0].should.have.property('is_landing_image')
  body[0].should.have.property('is_video')
}
