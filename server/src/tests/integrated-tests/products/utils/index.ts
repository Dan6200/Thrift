import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { readFile } from 'node:fs/promises'
import BadRequestError from '../../../../errors/bad-request.js'
import {
  ProductMedia,
  isValidProductRequestData,
  isValidProductListResponseData,
  isValidProductResponseData,
  isValidProductId,
} from '../../../../types-and-interfaces/products.js'
import {
  TestCreateRequest,
  TestCreateRequestWithBody,
  TestCreateRequestWithQParams,
  TestCreateRequestWithQParamsAndBody,
} from '../../../../types-and-interfaces/test-routes.js'
import testRoute from '../../test-route/index.js'

chai.use(chaiHttp).should()

const { CREATED, OK, NOT_FOUND } = StatusCodes

const testCreateProduct = async function* ({
  server,
  token,
  path,
  query,
  dataList,
}: {
  server: string
  token: string
  path: string
  query: object
  dataList: object[]
}) {
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
    if (!isValidProductId(response.body))
      throw new BadRequestError(
        'Product Id is the expected response after a product is created'
      )
    yield response.body
  }
}

export const testPostProduct = (<TestCreateRequestWithBody>testRoute)({
  statusCode: CREATED,
  verb: 'post',
  validateReqData: isValidProductRequestData,
  validateResData: isValidProductId,
})

export const testGetAllProductsWithQParams = (<TestCreateRequestWithQParams>(
  testRoute
))({
  statusCode: OK,
  verb: 'get',
  validateResData: isValidProductListResponseData,
})

const testGetAllProducts = (<TestCreateRequest>testRoute)({
  statusCode: OK,
  verb: 'get',
  validateResData: isValidProductListResponseData,
})

export const testGetAllProductsPublic = (<TestCreateRequestWithQParams>(
  testRoute
))({
  statusCode: OK,
  verb: 'get',
  validateResData: isValidProductListResponseData,
})

export const testGetProductWithQParams = (<TestCreateRequestWithQParams>(
  testRoute
))({
  statusCode: OK,
  verb: 'get',
  validateResData: isValidProductResponseData,
})

const testGetProduct = (<TestCreateRequest>testRoute)({
  statusCode: OK,
  verb: 'get',
  validateResData: isValidProductResponseData,
})

export const testGetProductPublic = (<TestCreateRequestWithQParams>testRoute)({
  statusCode: OK,
  verb: 'get',
  validateResData: isValidProductResponseData,
})

const testUpdateProduct = (<TestCreateRequestWithBody>testRoute)({
  statusCode: OK,
  verb: 'patch',
  validateReqData: isValidProductRequestData,
  validateResData: isValidProductId,
})

const testDeleteProduct = (<TestCreateRequest>testRoute)({
  statusCode: OK,
  verb: 'delete',
  validateResData: isValidProductId,
})

const testGetNonExistentProduct = (<TestCreateRequest>testRoute)({
  verb: 'get',
  statusCode: NOT_FOUND,
  validateResData: null,
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

  const descriptions = files.reduce((acc: { [k: string]: any }, file) => {
    acc[file.name] = file.description
    return acc
  }, {})

  const isDisplayImage = files.reduce((acc: { [k: string]: any }, file) => {
    acc[file.name] = file.is_display_image
    return acc
  }, {})

  const isLandingImage = files.reduce((acc: { [k: string]: any }, file) => {
    acc[file.name] = file.is_landing_image
    return acc
  }, {})

  const isVideo = files.reduce((acc: { [k: string]: any }, file) => {
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
