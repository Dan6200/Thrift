import 'express-async-errors';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { newUsers, users } from 'authentication/user-data';
import db from 'db';
import { deleteUser, getDeletedUser } from 'tests/helpers/user';
import registration from 'tests/helpers/auth/registration';
import {
	createShop,
	deleteShop,
	getAllDeletedShop,
	getAllShop,
	getDeletedShop,
	getShop,
	updateShop,
} from 'tests/helpers/user/vendor/shop';
import {
	testCreateVendor,
	testDeleteVendor,
	testGetDeletedVendor,
} from 'tests/helpers/user/vendor';
chai.use(chaiHttp).should();

export default async function testShop() {
	before(async () => {
		// deletes all entries from user_account
		await db.query('delete from user_account');
		await db.query('delete from vendor');
		await db.query('delete from shop');
		// clears the user token array
		await users.clear();
	});

	// Testing the register route
	describe('/POST user: Registration', () => {
		it(`it should register ${newUsers.length} new users`, registration);
	});

	// create the vendor acc
	describe('/POST vendor account', () => {
		it(`it should create a new vendor account`, testCreateVendor);
	});

	// Testing the shop route
	let shopIds: Array<string> = [];
	describe('/POST shop', () => {
		it(
			'it should create a shop for the vendor',
			createShop.bind(null, shopIds)
		);
	});
	describe('/GET shop', () => {
		it(
			`it should retrieve the vendor shop account`,
			getShop.bind(null, shopIds)
		);
	});
	describe('/GET all shop', () => {
		it(`it should retrieve all the vendor shop accounts`, getAllShop);
	});
	describe('/PUT shop', () => {
		it(
			'it should update the shop for the user',
			updateShop.bind(null, shopIds)
		);
	});
	describe('/DELETE shop', () => {
		it('it should delete the shop', deleteShop.bind(null, shopIds));
	});
	describe('/GET shop', () => {
		it(
			`it should fail to retrieve the vendor shop account`,
			getDeletedShop.bind(null, shopIds)
		);
	});
	describe('/GET all shop', () => {
		it(
			`it should fail to retrieve all the vendor shop accounts`,
			getAllDeletedShop
		);
	});

	// Delete vendor account
	describe('/DELETE vendor account', () => {
		it('it should delete the vendor account', testDeleteVendor);
	});
	describe('/GET vendor account', () => {
		it(
			`it should fail to retrieve the Vendor account`,
			testGetDeletedVendor
		);
	});
	// Delete user account
	describe('/DELETE user account', () => {
		it("it should delete the user's account", deleteUser);
	});
	describe('/GET user', () => {
		it(`it should fail to retrieve the User account`, getDeletedUser);
	});
}
