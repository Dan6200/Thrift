import 'express-async-errors';
import chai from 'chai';
import chaiHttp from 'chai-http';
import db from 'db';
import registration from 'tests/helpers/auth/registration';
import {
	testCreateProduct,
	testGetAllProduct,
	testGetProduct,
	testUpdateProduct,
	testDeleteProduct,
	testGetNonExistentProduct,
} from 'tests/helpers/user/vendor/product';
import { testCreateVendor } from 'tests/helpers/user/vendor';
chai.use(chaiHttp).should();

export default function testProduct() {
	beforeEach(async () => {
		// deletes all entries from user_account
		await db.query('delete from user_account');
	});
	describe('/POST product', () => {
		it('it should create a product for the vendor', async () =>
			registration()
				.then((tokens) => testCreateVendor(tokens))
				.then(({ authTokens }) => testCreateProduct(authTokens)));
	});
	describe('/GET product', () => {
		it(`it should retrieve the vendor product`, async () =>
			registration()
				.then((tokens) => testCreateVendor(tokens))
				.then(({ authTokens }) => testCreateProduct(authTokens))
				.then(({ responseList, authTokens }) => {
					let productIds: string[] = [];
					(responseList as any[]).forEach((response) => {
						const { product_id }: { product_id: string } = response;
						productIds.push(product_id);
					});
					return testGetProduct(authTokens, productIds);
				}));
	});
	describe('/GET all products', () => {
		it(`it should retrieve all the vendor's products`, async () =>
			registration()
				.then((tokens) => testCreateVendor(tokens))
				.then(({ authTokens }) => testCreateProduct(authTokens))
				.then(({ authTokens }) => testGetAllProduct(authTokens)));
	});
	describe('/PUT product', () => {
		it('it should update the product for the user', async () =>
			registration()
				.then((tokens) => testCreateVendor(tokens))
				.then(({ authTokens }) => testCreateProduct(authTokens))
				.then(({ responseList, authTokens }) => {
					let productIds: string[] = [];
					(responseList as any[]).forEach((response) => {
						const { product_id }: { product_id: string } = response;
						productIds.push(product_id);
					});
					return testUpdateProduct(authTokens, productIds);
				}));
	});
	describe('/DELETE product', () => {
		it('it should delete the product', () =>
			registration()
				.then((tokens) => testCreateVendor(tokens))
				.then(({ authTokens }) => testCreateProduct(authTokens))
				.then(({ responseList, authTokens }) => {
					let productIds: string[] = [];
					(responseList as any[]).forEach((response) => {
						const { product_id }: { product_id: string } = response;
						productIds.push(product_id);
					});
					return testDeleteProduct(authTokens, productIds);
				}));
	});
	describe('/GET product', () => {
		it(`it should fail to retrieve the vendor product`, () =>
			registration()
				.then((tokens) => testCreateVendor(tokens))
				.then(({ authTokens }) => testCreateProduct(authTokens))
				.then(({ responseList, authTokens }) => {
					let productIds: string[] = [];
					(responseList as any[]).forEach((response) => {
						const { product_id }: { product_id: string } = response;
						productIds.push(product_id);
					});
					return testDeleteProduct(authTokens, productIds);
				})
				.then(({ authTokens }) =>
					testGetNonExistentProduct(authTokens)
				));
	});
}
