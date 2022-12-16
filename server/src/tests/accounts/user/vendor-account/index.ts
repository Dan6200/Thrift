import 'express-async-errors';
import chai from 'chai';
import chaiHttp from 'chai-http';
import db from '../../../../db';
import registration from '../../../helpers/auth/registration';
import {
	testCreateVendor,
	testGetVendor,
	testDeleteVendor,
	testGetNonExistentVendor,
} from '../../../helpers/user/vendor';
chai.use(chaiHttp).should();

export default function testVendorAccount() {
	after(async () => {
		// deletes all entries from user_account
		await db.query('delete from user_account');
		await db.query('delete from vendor');
	});
	beforeEach(async () => {
		// deletes all entries from user_account
		await db.query('delete from user_account');
		await db.query('delete from vendor');
	});

	describe('/POST vendor account', async () => {
		// create new vendor account
		it(`it should create new user account then a new vendor account`, async () =>
			registration().then((tokens) => testCreateVendor(tokens)));
	});

	describe('/GET vendor account', () => {
		it(`it should create a new user account, create a vendor account and retrieve the vendor account`, async () =>
			registration()
				.then((tokens) => testCreateVendor(tokens))
				.then(({ authTokens }) => testGetVendor(authTokens)));
	});

	describe('/DELETE vendor account', () => {
		it('it should create and delete the vendor account', async () =>
			registration()
				.then((tokens) => testCreateVendor(tokens))
				.then(({ authTokens }) => testDeleteVendor(authTokens)));
	});

	describe('/GET nonexistent vendor account', () => {
		it(`it should fail to retrieve the vendor account`, async () =>
			registration().then((tokens) => testGetNonExistentVendor(tokens)));
	});
}
