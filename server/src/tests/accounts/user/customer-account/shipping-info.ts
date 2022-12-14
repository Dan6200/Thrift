import 'express-async-errors';
import chai from 'chai';
import chaiHttp from 'chai-http';
import db from 'db';
import registration from 'tests/helpers/auth/registration';
import {
	testCreateAddress,
	testGetAllAddress,
	testGetAddress,
	testUpdateAddress,
	testDeleteAddress,
	testGetNonExistentAddress,
} from 'tests/helpers/user/customer/shipping';
import { testCreateCustomer } from 'tests/helpers/user/customer';
chai.use(chaiHttp).should();

export default function testAddress() {
	beforeEach(async () => {
		// deletes all entries from user_account
		await db.query('delete from user_account');
	});
	describe('/POST address', () => {
		it('it should create a address for the customer', async () =>
			registration()
				.then((tokens) => testCreateCustomer(tokens))
				.then(({ authTokens }) => testCreateAddress(authTokens)));
	});
	describe('/GET address', () => {
		it(`it should retrieve the customer address`, async () =>
			registration()
				.then((tokens) => testCreateCustomer(tokens))
				.then(({ authTokens }) => testCreateAddress(authTokens))
				.then(({ responseList, authTokens }) => {
					let addressIds: string[] = [];
					(responseList as any[]).forEach((response) => {
						const { address_id }: { address_id: string } = response;
						addressIds.push(address_id);
					});
					return testGetAddress(authTokens, addressIds);
				}));
	});
	describe('/GET all address', () => {
		it(`it should retrieve all the customer's address`, async () =>
			registration()
				.then((tokens) => testCreateCustomer(tokens))
				.then(({ authTokens }) => testCreateAddress(authTokens))
				.then(({ authTokens }) => testGetAllAddress(authTokens)));
	});
	describe('/PUT address', () => {
		it('it should update the address for the user', async () =>
			registration()
				.then((tokens) => testCreateCustomer(tokens))
				.then(({ authTokens }) => testCreateAddress(authTokens))
				.then(({ responseList, authTokens }) => {
					let addressIds: string[] = [];
					(responseList as any[]).forEach((response) => {
						const { address_id }: { address_id: string } = response;
						addressIds.push(address_id);
					});
					return testUpdateAddress(authTokens, addressIds);
				}));
	});
	describe('/DELETE address', () => {
		it('it should delete the address', () =>
			registration()
				.then((tokens) => testCreateCustomer(tokens))
				.then(({ authTokens }) => testCreateAddress(authTokens))
				.then(({ responseList, authTokens }) => {
					let addressIds: string[] = [];
					(responseList as any[]).forEach((response) => {
						const { address_id }: { address_id: string } = response;
						addressIds.push(address_id);
					});
					return testDeleteAddress(authTokens, addressIds);
				}));
	});
	describe('/GET address', () => {
		it(`it should fail to retrieve the customer address`, () =>
			registration()
				.then((tokens) => testCreateCustomer(tokens))
				.then(({ authTokens }) => testCreateAddress(authTokens))
				.then(({ responseList, authTokens }) => {
					let addressIds: string[] = [];
					(responseList as any[]).forEach((response) => {
						const { address_id }: { address_id: string } = response;
						addressIds.push(address_id);
					});
					return testDeleteAddress(authTokens, addressIds);
				})
				.then(({ authTokens }) =>
					testGetNonExistentAddress(authTokens)
				));
	});
}
