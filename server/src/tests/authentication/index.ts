import db from 'db';
import { newUsers, loginUsers } from 'authentication/user-data';
import registration from 'tests/helpers/auth/registration';
import login from 'tests/helpers/auth/login';

export default function (): void {
	before(async () => {
		// deletes all entries from user_account
		await db.query('delete from user_account');
	});
	beforeEach(async () => {
		// initializes with empty array
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
