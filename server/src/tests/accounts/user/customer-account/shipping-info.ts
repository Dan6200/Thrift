import 'express-async-errors';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { newUsers, users } from 'authentication/user-data';
import db from 'db';
import { deleteUser, getDeletedUser } from 'tests/helpers/user';
import registration from 'tests/helpers/auth/registration';
import {
	createShipping,
	getShipping,
	getAllShipping,
	updateShipping,
	deleteShipping,
	getDeletedShipping,
	getAllDeletedShipping,
} from 'tests/helpers/user/customer/shipping';
import { testCreateCustomer } from 'tests/helpers/user/customer';
chai.use(chaiHttp).should();

export default async function testShippingInfo() {
	before(async () => {
		// deletes all entries from user_account
		await db.query('delete from user_account');
		// clears the user token array
		await users.clear();
	});

	// Testing the register route
	describe('/POST user: Registration', () => {
		it(`it should register ${newUsers.length} new users`, registration);
	});

	// Testing the register route
	describe('/POST customer account', () => {
		it(`it should create new customer accounts`, testCreateCustomer);
	});

	// Testing the shipping route
	let addressIds: Array<string> = [];
	describe('/POST shipping info', () => {
		it(
			'it should create a shipping info for the customer',
			createShipping.bind(null, addressIds)
		);
	});
	describe('/GET shipping info', () => {
		it(
			`it should retrieve the customer shipping account`,
			getShipping.bind(null, addressIds)
		);
	});
	describe('/GET all shipping info', () => {
		it(
			`it should retrieve all the customer shipping accounts`,
			getAllShipping
		);
	});
	describe('/PUT shipping info', () => {
		it(
			'it should update the shipping info for the user',
			updateShipping.bind(null, addressIds)
		);
	});
	describe('/DELETE shipping info', () => {
		it(
			'it should delete the shipping info',
			deleteShipping.bind(null, addressIds)
		);
	});
	describe('/GET shipping info', () => {
		it(
			`it should fail to retrieve the customer shipping account`,
			getDeletedShipping.bind(null, addressIds)
		);
	});
	describe('/GET all shipping info', () => {
		it(
			`it should fail to retrieve all the customer shipping accounts`,
			getAllDeletedShipping
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
