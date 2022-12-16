import db from '../../db';
import login from '../helpers/auth/login';
import registration from '../helpers/auth/registration';
import { newUsers, loginUsers } from './user-data';

export default function (): void {
	before(async () => {
		// deletes all entries from user_account
		await db.query('delete from user_account');
	});
	after(async () => {
		await db.query('delete from user_account');
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
