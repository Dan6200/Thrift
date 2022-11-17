import 'express-async-errors';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { newUsers, userDataTesting } from 'authentication/user-data';
import db from 'db';
import { deleteUser, getDeletedUser } from 'tests/helpers/user';
import registration from 'tests/helpers/auth/registration';
import {
	testCreateProduct,
	testDeleteProduct,
	testGetAllProduct,
	testGetDeletedProduct,
	testGetProduct,
	testUpdateProduct,
} from 'tests/helpers/user/vendor/product';
import {
	testCreateVendor,
	testDeleteVendor,
	testGetNonExistentVendor,
} from 'tests/helpers/user/vendor';
import path from 'path';
const filename = path.basename(__filename);
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
				.then(({ authTokens }) => testCreateProduct(authTokens))
				.catch((err) => {
					throw err;
				}));
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
				})
				.catch((err) => {
					throw err;
				}));
	});
	describe('/GET all product', () => {
		it(`it should retrieve the vendor product`, async () =>
			registration()
				.then((tokens) => testCreateVendor(tokens))
				.then(({ authTokens }) => testCreateProduct(authTokens))
				.then(({ authTokens }) => testGetAllProduct(authTokens))
				.catch((err) => {
					throw err;
				}));
	});
	/*
	describe('/PUT product', () => {
		it('it should update the product for the user', testUpdateProduct);
	});
	describe('/DELETE product', () => {
		it('it should delete the product', testDeleteProduct);
	});
	describe('/GET product', () => {
		it(
			`it should fail to retrieve the vendor product`,
			testGetDeletedProduct
		);
	});
	// Delete vendor
	describe('/DELETE vendor', () => {
		it('it should delete the vendor', testDeleteVendor);
	});
	describe('/GET vendor', () => {
		it(`it should fail to retrieve the Vendor`, testGetDeletedVendor);
	});
	// Delete user
	describe('/DELETE user', () => {
		it("it should delete the user's", deleteUser);
	});
	describe('/GET user', () => {
		it(`it should fail to retrieve the User`, getDeletedUser);
	});
	*/
}
