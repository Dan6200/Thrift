import 'express-async-errors';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { newUsers, users } from 'authentication/user-data';
import db from 'db';
import registration from 'tests/helpers/registration';
import {
	createShop,
	getShop,
	getAllShop,
	updateShop,
	deleteShop,
	getDeletedShop,
	getAllDeletedShop,
} from 'tests/helpers/shop';
import { deleteUser, getDeletedUser } from 'tests/helpers/user';
chai.use(chaiHttp).should();

export default async function testShop() {
	before(async () => {
		// deletes all entries from user_account
		await db.query('delete from user_account');
		await db.query('delete from shop');
		// clears the user token array
		await users.clear();
	});

	// Testing the register route
	describe('/POST user: Registration', () => {
		it(`it should register ${newUsers.length} new users`, registration);
	});

	// Testing the shop route
	let shopIds: Array<string> = [];
	describe('/POST shop', () => {
		it(
			'it should create a shop for the customer',
			createShop.bind(null, shopIds)
		);
	});
	describe('/GET shop', () => {
		it(
			`it should retrieve the customer shop account`,
			getShop.bind(null, shopIds)
		);
	});
	describe('/GET all shop', () => {
		it(`it should retrieve all the customer shop accounts`, getAllShop);
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
			`it should fail to retrieve the customer shop account`,
			getDeletedShop.bind(null, shopIds)
		);
	});
	describe('/GET all shop', () => {
		it(
			`it should fail to retrieve all the customer shop accounts`,
			getAllDeletedShop
		);
	});

	// Delete user account
	describe('/DELETE user account', () => {
		it("it should delete the user's account", deleteUser);
	});
	describe('/GET user', () => {
		it(`it should retrieve the User account`, getDeletedUser);
	});
}
