import 'express-async-errors';
import chai from 'chai';
import chaiHttp from 'chai-http';
import {
	testCreateVendor,
	testGetVendor,
	testDeleteVendor,
	testGetNonExistentVendor,
} from 'tests/helpers/user/vendor';
import db from 'db';
import { userDataTesting } from 'tests/authentication/user-data';
import registration from 'tests/helpers/auth/registration';
chai.use(chaiHttp).should();

export default function testVendorAccount() {
	beforeEach(async () => {
		// deletes all entries from user_account
		await db.query('delete from user_account');
	});

	describe('/POST vendor account', async () => {
		// create new vendor account
		it(`it should create new user account then a new vendor account`, async () =>
			registration()
				.then((tokens) => testCreateVendor(tokens))
				.catch((err) => {
					throw err;
				}));
	});

	describe('/GET vendor account', () => {
		it(`it should create a new user account, create a vendor account and retrieve the vendor account`, async () =>
			registration()
				.then((tokens) => testCreateVendor(tokens))
				.then(({ authTokens }) => testDeleteVendor(authTokens))
				.catch((err) => {
					throw err;
				}));
	});

	describe('/DELETE vendor account', () => {
		it('it should create and delete the vendor account', async () =>
			registration()
				.then((tokens) => testCreateVendor(tokens))
				.then(({ authTokens }) => testGetVendor(authTokens))
				.catch((err) => {
					throw err;
				}));
	});

	describe('/GET nonexistent vendor account', () => {
		it(`it should fail to retrieve the vendor account`, async () =>
			registration().then((tokens) => testGetNonExistentVendor(tokens)));
	});
}
