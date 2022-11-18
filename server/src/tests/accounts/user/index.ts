import 'express-async-errors';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { newUsers, userDataTesting } from 'authentication/user-data';
import db from 'db';
import {
	getUser,
	patchUser,
	patchUserPassword,
	deleteUser,
	getDeletedUser,
} from 'tests/helpers/user';
import registration from 'tests/helpers/auth/registration';

chai.use(chaiHttp).should();
/*
export default async function testUserAccount() {
	before(async () => {
		// deletes all entries from user_account
		await db.query('delete from user_account');
		// initializes or resets the field array
		await userDataTesting.reset('tokens');
	});
	// Testing the register route
	describe('/POST user: Registration', () => {
		it(`it should register ${newUsers.length} new users`, registration);
	});
	describe('/GET user', () => {
		it(`it should retrieve the User account`, getUser);
	});
	describe('/PATCH user', () => {
		it('it should update the user info', patchUser);
	});
	describe('/PATCH user password', function () {
		it("it should update the user's password", patchUserPassword);
	});
	describe('/DELETE user account', () => {
		it("it should delete the user's account", deleteUser);
	});
	describe('/GET user', () => {
		it(`it should fail to retrieve the User account`, getDeletedUser);
	});
}
*/
export default function testUserAccount() {
	beforeEach(async () => {
		// deletes all entries from user_account
		await db.query('delete from user_account');
	});

	describe('/GET user account', () => {
		it(`it should retrieve the user account`, async () =>
			registration()
				.then((tokens) => testGetUser(tokens))
				.catch((err) => {
					throw err;
				}));
	});
	/*
	describe('/GET user account', () => {
		it(`it should create a new user account, create a user account and retrieve the user account`, async () =>
			registration()
				.then((tokens) => testGetUser(tokens))
				.catch((err) => {
					throw err;
				}));
	});

	describe('/DELETE user account', () => {
		it('it should create and delete the user account', async () =>
			registration()
				.then((tokens) => testGetUser(tokens))
				.catch((err) => {
					throw err;
				}));
	});

	describe('/GET nonexistent user account', () => {
		it(`it should fail to retrieve the user account`, async () =>
			registration().then((tokens) => testGetNonExistentUser(tokens)));
	});
	*/
}
