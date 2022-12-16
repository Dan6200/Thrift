import 'express-async-errors';
import chai from 'chai';
import chaiHttp from 'chai-http';
import db from '../../../db';
import registration from '../../helpers/auth/registration';
import {
	testGetUser,
	testUpdateUser,
	testChangeUserPassword,
	testDeleteUser,
	testGetNonExistentUser,
} from '../../helpers/user';

chai.use(chaiHttp).should();

export default function testUserAccount() {
	beforeEach(async () => {
		// deletes all entries from user_account
		await db.query('delete from user_account');
	});
	after(async () => {
		// deletes all entries from user_account
		await db.query('delete from user_account');
	});

	describe('/GET user account', () => {
		it(`it should retrieve the user info`, async () =>
			registration().then((tokens) => testGetUser(tokens)));
	});

	describe('/PATCH user account', () => {
		it(`It should update the user info`, async () =>
			registration().then((tokens) => testUpdateUser(tokens)));
	});

	describe('/PATCH user account password', () => {
		it(`It should update the user password`, async () =>
			registration().then((tokens) => testChangeUserPassword(tokens)));
	});

	describe('/DELETE user account', () => {
		it('it should create and delete the user account', async () =>
			registration().then((tokens) => testDeleteUser(tokens)));
	});

	describe('/GET nonexistent user account', () => {
		it(`it should fail to retrieve the user account`, async () =>
			registration()
				.then((tokens) => testDeleteUser(tokens))
				.then(({ authTokens }) => testGetNonExistentUser(authTokens)));
	});
}
