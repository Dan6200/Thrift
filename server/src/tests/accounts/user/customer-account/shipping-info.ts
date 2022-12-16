import 'express-async-errors';
import chai from 'chai';
import chaiHttp from 'chai-http';
import db from '../../../../db';
import registration from '../../../helpers/auth/registration';
import { testCreateCustomer } from '../../../helpers/user/customer';
import {
	testCreateShipping,
	testGetShipping,
	testGetAllShipping,
	testUpdateShipping,
	testDeleteShipping,
	testGetNonExistentShipping,
} from '../../../helpers/user/customer/shipping';
chai.use(chaiHttp).should();

export default function testShipping() {
	after(async () => {
		// deletes all entries from user_account
		await db.query('delete from user_account');
		await db.query('delete from customer');
		await db.query('delete from shipping_info');
	});
	beforeEach(async () => {
		// deletes all entries from user_account
		await db.query('delete from user_account');
		await db.query('delete from customer');
		await db.query('delete from shipping_info');
	});
	describe('/POST address', () => {
		it('it should create a address for the customer', () =>
			registration()
				.then((tokens) => testCreateCustomer(tokens))
				.then(({ authTokens }) => testCreateShipping(authTokens)));
	});
	describe('/GET address', () => {
		it(`it should retrieve the customer address`, () =>
			registration()
				.then((tokens) => testCreateCustomer(tokens))
				.then(({ authTokens }) => testCreateShipping(authTokens))
				.then(({ responseList, authTokens }) => {
					let addressIds: string[] = [];
					(responseList as any[]).forEach((response) => {
						const { address_id }: { address_id: string } = response;
						addressIds.push(address_id);
					});
					return testGetShipping(authTokens, addressIds);
				}));
	});
	describe('/GET all address', () => {
		it(`it should retrieve all the customer's address`, () =>
			registration()
				.then((tokens) => testCreateCustomer(tokens))
				.then(({ authTokens }) => testCreateShipping(authTokens))
				.then(({ authTokens }) => testGetAllShipping(authTokens)));
	});
	describe('/PUT address', () => {
		it('it should update the address for the user', () =>
			registration()
				.then((tokens) => testCreateCustomer(tokens))
				.then(({ authTokens }) => testCreateShipping(authTokens))
				.then(({ responseList, authTokens }) => {
					let addressIds: string[] = [];
					(responseList as any[]).forEach((response) => {
						const { address_id }: { address_id: string } = response;
						addressIds.push(address_id);
					});
					return testUpdateShipping(authTokens, addressIds);
				}));
	});
	describe('/DELETE address', () => {
		it('it should delete the address', () =>
			registration()
				.then((tokens) => testCreateCustomer(tokens))
				.then(({ authTokens }) => testCreateShipping(authTokens))
				.then(({ responseList, authTokens }) => {
					let addressIds: string[] = [];
					(responseList as any[]).forEach((response) => {
						const { address_id }: { address_id: string } = response;
						addressIds.push(address_id);
					});
					return testDeleteShipping(authTokens, addressIds);
				}));
	});
	describe('/GET address', () => {
		it(`it should fail to retrieve the customer address`, () =>
			registration()
				.then((tokens) => testCreateCustomer(tokens))
				.then(({ authTokens }) => testCreateShipping(authTokens))
				.then(({ responseList, authTokens }) => {
					let addressIds: string[] = [];
					(responseList as any[]).forEach((response) => {
						const { address_id }: { address_id: string } = response;
						addressIds.push(address_id);
					});
					return testDeleteShipping(authTokens, addressIds);
				})
				.then(({ authTokens }) =>
					testGetNonExistentShipping(authTokens)
				));
	});
}
