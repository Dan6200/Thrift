import 'express-async-errors';
import chai from 'chai';
import chaiHttp from 'chai-http';
import db from 'db';
import registration from 'tests/helpers/auth/registration';
import {
	testCreateShop,
	testGetShop,
	testDeleteShop,
	testGetAllShop,
	testUpdateShop,
	testGetDeletedShop,
} from 'tests/helpers/user/vendor/shop';
import { testCreateVendor } from 'tests/helpers/user/vendor';
chai.use(chaiHttp).should();

export default async function testShop() {
	before(async () => {
		// deletes all entries from user_account
		await db.query('delete from user_account');
		await db.query('delete from vendor');
		await db.query('delete from shop');
		// initializes with empty array
	});

	// Testing the shop route
	describe('/POST shop', () => {
		it('it should create a shop for the vendor', () =>
			registration()
				.then((tokens) => testCreateVendor(tokens))
				.then(({ authTokens }) => testCreateShop(authTokens)));
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
			testGetNonExistentShop
		);
	});
}
