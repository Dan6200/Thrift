import 'express-async-errors';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { newUsers, users } from 'authentication/user-data';
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

export default function testUserAccount() {
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
	describe('/GET user', () => {
		it(`it should retrieve the User account`, getUser);
	});
	describe('/PATCH user', () => {
		it('it should update the user info', patchUser);
	});
	describe('/PATCH user password', () => {
		it("it should update the user's password", patchUserPassword);
	});
	describe('/DELETE user account', () => {
		it("it should delete the user's account", deleteUser);
	});
	describe('/GET user', () => {
		it(`it should fail to retrieve the User account`, getDeletedUser);
	});
}
