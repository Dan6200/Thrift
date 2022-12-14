import 'express-async-errors';
import chai from 'chai';
import chaiHttp from 'chai-http';
import db from 'db';
import registration from 'tests/helpers/auth/registration';
import {
	testCreateShop,
	testGetAllShop,
	testGetShop,
	testUpdateShop,
	testDeleteShop,
	testGetNonExistentShop,
} from 'tests/helpers/user/vendor/shop';
import { testCreateVendor } from 'tests/helpers/user/vendor';
chai.use(chaiHttp).should();

export default function testShop() {
	beforeEach(async () => {
		// deletes all entries from user_account
		await db.query('delete from user_account');
	});
	describe('/POST shop', () => {
		it('it should create a shop for the vendor', async () =>
			registration()
				.then((tokens) => testCreateVendor(tokens))
				.then(({ authTokens }) => testCreateShop(authTokens)));
	});
	describe('/GET shop', () => {
		it(`it should retrieve the vendor shop`, async () =>
			registration()
				.then((tokens) => testCreateVendor(tokens))
				.then(({ authTokens }) => testCreateShop(authTokens))
				.then(({ responseList, authTokens }) => {
					let shopIds: string[] = [];
					(responseList as any[]).forEach((response) => {
						const { shop_id }: { shop_id: string } = response;
						shopIds.push(shop_id);
					});
					return testGetShop(authTokens, shopIds);
				}));
	});
	describe('/GET all shops', () => {
		it(`it should retrieve all the vendor's shops`, async () =>
			registration()
				.then((tokens) => testCreateVendor(tokens))
				.then(({ authTokens }) => testCreateShop(authTokens))
				.then(({ authTokens }) => testGetAllShop(authTokens)));
	});
	describe('/PUT shop', () => {
		it('it should update the shop for the user', async () =>
			registration()
				.then((tokens) => testCreateVendor(tokens))
				.then(({ authTokens }) => testCreateShop(authTokens))
				.then(({ responseList, authTokens }) => {
					let shopIds: string[] = [];
					(responseList as any[]).forEach((response) => {
						const { shop_id }: { shop_id: string } = response;
						shopIds.push(shop_id);
					});
					return testUpdateShop(authTokens, shopIds);
				}));
	});
	describe('/DELETE shop', () => {
		it('it should delete the shop', () =>
			registration()
				.then((tokens) => testCreateVendor(tokens))
				.then(({ authTokens }) => testCreateShop(authTokens))
				.then(({ responseList, authTokens }) => {
					let shopIds: string[] = [];
					(responseList as any[]).forEach((response) => {
						const { shop_id }: { shop_id: string } = response;
						shopIds.push(shop_id);
					});
					return testDeleteShop(authTokens, shopIds);
				}));
	});
	describe('/GET shop', () => {
		it(`it should fail to retrieve the vendor shop`, () =>
			registration()
				.then((tokens) => testCreateVendor(tokens))
				.then(({ authTokens }) => testCreateShop(authTokens))
				.then(({ responseList, authTokens }) => {
					let shopIds: string[] = [];
					(responseList as any[]).forEach((response) => {
						const { shop_id }: { shop_id: string } = response;
						shopIds.push(shop_id);
					});
					return testDeleteShop(authTokens, shopIds);
				})
				.then(({ authTokens }) => testGetNonExistentShop(authTokens)));
	});
}
