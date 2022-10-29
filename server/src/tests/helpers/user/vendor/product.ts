import application from 'application';
import testProcessRoute from 'tests/helpers/test-process-route';
import { StatusCodes } from 'http-status-codes';
import {
	productData,
	updateProductData,
} from 'tests/accounts/user/vendor-account/product/data';

const { CREATED, OK, NOT_FOUND } = StatusCodes;

let outputData: any = {},
	checkId = (data: any) => {
		data.should.have.property('product_id');
		data.product_id.should.be.a('string');
	};

const routeParams = {
	server: application,
	urls: [`/api/v1/user/vendor/shop/products`],
	statusCode: OK,
};

const testCreateProduct = testProcessRoute({
	...routeParams,
	verb: 'post',
	statusCode: CREATED,
	data: productData,
	checks: checkId,
	outputData,
});

const productIds: string[] = [];
productIds.push(outputData.product_id);
const urls = productIds.map(
	(productId) => '/api/v1/user/vendor/shop/products/' + { productId }
);

const testGetAllProduct = testProcessRoute({
	...routeParams,
	verb: 'get',
});

const testGetProduct = testProcessRoute({
	...routeParams,
	verb: 'get',
	urls,
	// TODO: this is wrong, returns an array of urls
	statusCode: OK,
});

const testUpdateProduct = testProcessRoute({
	server: application,
	verb: 'put',
	urls,
	statusCode: OK,
	data: updateProductData,
});

const testDeleteProduct = testProcessRoute({
	server: application,
	verb: 'delete',
	urls,
	statusCode: OK,
});

const testGetDeletedProduct = testProcessRoute({
	server: application,
	verb: 'get',
	urls,
	statusCode: NOT_FOUND,
});

export {
	testCreateProduct,
	testGetAllProduct,
	testGetProduct,
	testUpdateProduct,
	testDeleteProduct,
	testGetDeletedProduct,
};
