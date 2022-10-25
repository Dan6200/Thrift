import 'express-async-errors';
import chai from 'chai';
import chaiHttp from 'chai-http';
import {
	testCreateCustomer,
	testGetCustomer,
	testDeleteCustomer,
	testGetDeletedCustomer,
} from 'tests/helpers/user/customer';
import db from 'db';
import { newUsers, users } from 'tests/authentication/user-data';
import registration from 'tests/helpers/auth/registration';
import { deleteUser, getDeletedUser } from 'tests/helpers/user';
chai.use(chaiHttp).should();

export default function testCustomerAccount() {
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
	describe('/POST customer account', () => {
		it(`it should create new customer account`, testCreateCustomer);
	});
	describe('/GET customer account', () => {
		it(`it should retrieve the customer account`, testGetCustomer);
	});
	describe('/DELETE customer account', () => {
		it('it should delete the customer account', testDeleteCustomer);
	});
	describe('/GET customer', () => {
		it(
			`it should fail to retrieve the customer account`,
			testGetDeletedCustomer
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
