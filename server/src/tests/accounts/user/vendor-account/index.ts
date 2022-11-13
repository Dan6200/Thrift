import 'express-async-errors';
import chai from 'chai';
import chaiHttp from 'chai-http';
import {
	testCreateVendor,
	testGetVendor,
	testDeleteVendor,
	testGetDeletedVendor,
} from 'tests/helpers/user/vendor';
import db from 'db';
import { newUsers, userDataTesting } from 'tests/authentication/user-data';
import registration from 'tests/helpers/auth/registration';
import { deleteUser, getDeletedUser } from 'tests/helpers/user';
chai.use(chaiHttp).should();

export default function testVendorAccount() {
	before(async () => {
		// deletes all entries from user_account
		await db.query('delete from user_account');
		// clears the user token array
		await userDataTesting.clear('token');
	});

	// Testing the register route
	describe('\n\n/POST user: Registration', () => {
		it(`it should register ${newUsers.length} new users`, registration);
	});
	describe('\n\n/POST vendor account', () => {
		it(`it should create new vendor account`, testCreateVendor);
	});
	describe('\n\n/GET vendor account', () => {
		it(`it should retrieve the vendor account`, testGetVendor);
	});
	describe('\n\n/DELETE vendor account', () => {
		it('it should delete the vendor account', testDeleteVendor);
	});
	describe('\n\n/GET vendor', () => {
		it(
			`it should fail to retrieve the vendor account`,
			testGetDeletedVendor
		);
	});
	// Delete user account
	describe('\n\n/DELETE user account', () => {
		it("it should delete the user's account", deleteUser);
	});
	describe('\n\n/GET user', () => {
		it(`it should retrieve the User account`, getDeletedUser);
	});
}
