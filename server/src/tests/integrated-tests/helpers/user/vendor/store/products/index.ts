import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ProductSchemaDB } from '../../../../../../../app-schema/products.js'
import {
	testRouteNoData,
	testRouteWithData,
} from '../../../../../../../types-and-interfaces/test-routes.js'
import testRoute from '../../../../test-route.js'

chai.use(chaiHttp).should()

const { CREATED, OK, NOT_FOUND } = StatusCodes

let checkId = async (data: any) => {
	data.should.have.property('product_id')
	data.product_id.should.be.a('number')
}

let validateResult = async (data: any) => {
	let productInfo = data
	productInfo.should.be.an('object')
	Joi.assert(productInfo, ProductSchemaDB)
}

let validateResultList = (data: any) => {
	data.should.be.an('array')
	validateResult(data[0])
}

const routeParams = {
	statusCode: OK,
}

const testCreateProduct = async function* (
	server: string,
	token: string,
	path: string,
	dataList: object[]
) {
	const range = dataList.length
	for (let idx = 0; idx < range; idx++) {
		const response = await chai
			.request(server)
			.post(path)
			.send(dataList[idx])
			.auth(token, { type: 'bearer' })
		response.should.have.status(CREATED)
		// Check that the response contains the product id
		checkId(response.body)
		yield response.body
	}
}

const testGetAllProducts = async function (
	server: string,
	token: string,
	path: string,
	query?: object
): Promise<any> {
	const response = await chai
		.request(server)
		.get(path)
		.query(query ?? {})
		.auth(token, { type: 'bearer' })
	response.should.have.status(OK)
	// Check that the data in the body is accurate
	validateResultList(response.body)
	response.body
}

const testGetProduct = <testRouteNoData>testRoute({
	...routeParams,
	verb: 'get',
	checks: validateResult,
})

const testUpdateProduct = <testRouteWithData>testRoute({
	...routeParams,
	verb: 'patch',
	checks: checkId,
})

const testDeleteProduct = <testRouteNoData>testRoute({
	...routeParams,
	verb: 'delete',
})

const testGetNonExistentProduct = <testRouteNoData>testRoute({
	...routeParams,
	verb: 'get',
	statusCode: NOT_FOUND,
})

const testUploadProductMedia = async function (
	server: string,
	token: string,
	urlPath: string,
	files: any[]
): Promise<any> {
	const fieldName = 'product-media'
	const request = chai
		.request(server)
		.post(urlPath)
		.auth(token, { type: 'bearer' })
	request.field('description', files[0].description)
	await Promise.all(
		files.map(async file => {
			const data = await readFile(file.path)
			request.attach(fieldName, data, path.basename(file.path))
		})
	)
	const response = await request

	response.should.have.status(CREATED)
	// Check the data in the body if accurate
	response.body.should.be.an('array')
	response.body[0].should.be.an('object')
	const responseObject = response.body[0]
	responseObject.should.have.property('filename')
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
