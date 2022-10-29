import 'express-async-errors';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { newUsers, users } from 'authentication/user-data';
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
	testGetDeletedVendor,
} from 'tests/helpers/user/vendor';
chai.use(chaiHttp).should();

export default async function testProduct() {
	before(async () => {
		// deletes all entries from user_account
		await db.query('delete from user_account');
		await db.query('delete from vendor');
		await db.query('delete from product');
		// clears the user token array
		await users.clear();
	});

	// Testing the register route
	describe('/POST user: Registration', () => {
		it(`it should register ${newUsers.length} new users`, registration);
	});

	// create the vendor acc
	describe('/POST vendor', () => {
		it(`it should create a new vendor`, testCreateVendor);
	});

	// Testing the product route
	let productIds: Array<string> = [];
	describe('/POST product', () => {
		it(
			'it should create a product for the vendor',
			testCreateProduct.bind(null, productIds)
		);
	});
	describe('/GET product', () => {
		it(
			`it should retrieve the vendor product`,
			testGetProduct.bind(null, productIds)
		);
	});
	describe('/GET all product', () => {
		it(`it should retrieve all the vendor products`, testGetAllProduct);
	});
	describe('/PUT product', () => {
		it(
			'it should update the product for the user',
			testUpdateProduct.bind(null, productIds)
		);
	});
	describe('/DELETE product', () => {
		it(
			'it should delete the product',
			testDeleteProduct.bind(null, productIds)
		);
	});
	describe('/GET product', () => {
		it(
			`it should fail to retrieve the vendor product`,
			testGetDeletedProduct.bind(null, productIds)
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
}
