import db from 'db';
import { newUsers, loginUsers, users } from 'authentication/user-data';
import { login, registration } from 'tests/helpers';

export default async function (): Promise<void> {
	before(async () => {
		// deletes all entries from user_account
		await db.query('delete from user_account');
	});
	beforeEach(async () => {
		// clears the user token array
		await users.clear();
	});
	// Testing the register route
	describe('/POST user: Registration', () => {
		it(`it should register ${newUsers.length} new users`, registration);
	});
	// Testing the login route
	describe('/POST user: Login', () => {
		const noOfUsers = loginUsers.length;
		it(`it should login ${noOfUsers} users`, login);
	});
}
