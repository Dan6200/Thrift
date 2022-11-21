import 'express-async-errors';
import chai from 'chai';
import chaiHttp from 'chai-http';
import db from 'db';
import {
	testUpdateUser,
	testChangeUserPassword,
	testDeleteUser,
	testGetUser,
	testGetNonExistentUser,
} from 'tests/helpers/user';
import registration from 'tests/helpers/auth/registration';

chai.use(chaiHttp).should();

export default function testUserAccount() {
	beforeEach(async () => {
		// deletes all entries from user_account
		await db.query('delete from user_account');
	});

	describe('/GET user account', () => {
		it(`it should retrieve the user info`, async () =>
			registration()
				.then((tokens) => testGetUser(tokens))
				.catch((err) => {
					throw err;
				}));
	});

	describe('/PATCH user account', () => {
		it(`It should update the user info`, async () =>
			registration()
				.then((tokens) => testUpdateUser(tokens))
				.catch((err) => {
					throw err;
				}));
	});

	describe('/PATCH user account password', () => {
		it(`It should update the user password`, async () =>
			registration()
				.then((tokens) =>
					testChangeUserPassword().then(
						(changeUserPasswordFuncList) => {
							let promiseList: Promise<any>[] = [];
							for (let changeEachPassword of changeUserPasswordFuncList) {
								promiseList.push(changeEachPassword(tokens));
							}
							return Promise.all(promiseList);
						}
					)
				)
				.catch((err) => {
					throw err;
				}));
	});

	describe('/DELETE user account', () => {
		it('it should create and delete the user account', async () =>
			registration()
				.then((tokens) => testDeleteUser(tokens))
				.catch((err) => {
					throw err;
				}));
	});

	describe('/GET nonexistent user account', () => {
		it(`it should fail to retrieve the user account`, async () =>
			registration()
				.then((tokens) => testDeleteUser(tokens))
				.then(({ authTokens }) => testGetNonExistentUser(authTokens)));
	});
}
