import "express-async-errors";
import chai from "chai";
import chaiHttp from "chai-http";

// import {
//   testCreateStore,
//   testDeleteStore,
//   testGetAllStore,
//   testGetNonExistentStore,
//   testGetStore,
//   testUpdateStore,
// } from "../../../../helpers/user/vendor/store";
// import db from "../../../../../db";
// import { testCreateVendor } from "../../../../helpers/user/vendor";
// chai.use(chaiHttp).should();

export default function testStore() {
  // beforeEach(async () => {
  // 	// deletes all entries from user_account
  // 	await db.query('delete from user_account');
  // 	await db.query('delete from vendor');
  // 	await db.query('delete from store');
  // });
  // after(async () => {
  // 	// deletes all entries from user_account
  // 	await db.query('delete from user_account');
  // 	await db.query('delete from vendor');
  // 	await db.query('delete from store');
  // });
  // describe('/POST store', () => {
  // 	it('it should create a store for the vendor', async () =>
  // 		registration()
  // 			.then((tokens) => testCreateVendor(tokens))
  // 			.then(({ authTokens }) => testCreateStore(authTokens)));
  // });
  // describe('/GET store', () => {
  // 	it(`it should retrieve the vendor store`, async () =>
  // 		registration()
  // 			.then((tokens) => testCreateVendor(tokens))
  // 			.then(({ authTokens }) => testCreateStore(authTokens))
  // 			.then(({ responseList, authTokens }) => {
  // 				let storeIds: string[] = [];
  // 				(responseList as any[]).forEach((response) => {
  // 					const { store_id }: { store_id: string } = response;
  // 					storeIds.push(store_id);
  // 				});
  // 				return testGetStore(authTokens, storeIds);
  // 			}));
  // });
  // describe('/GET all stores', () => {
  // 	it(`it should retrieve all the vendor's stores`, async () =>
  // 		registration()
  // 			.then((tokens) => testCreateVendor(tokens))
  // 			.then(({ authTokens }) => testCreateStore(authTokens))
  // 			.then(({ authTokens }) => testGetAllStore(authTokens)));
  // });
  // describe('/PUT store', () => {
  // 	it('it should update the store for the user', async () =>
  // 		registration()
  // 			.then((tokens) => testCreateVendor(tokens))
  // 			.then(({ authTokens }) => testCreateStore(authTokens))
  // 			.then(({ responseList, authTokens }) => {
  // 				let storeIds: string[] = [];
  // 				(responseList as any[]).forEach((response) => {
  // 					const { store_id }: { store_id: string } = response;
  // 					storeIds.push(store_id);
  // 				});
  // 				return testUpdateStore(authTokens, storeIds);
  // 			}));
  // });
  // describe('/DELETE store', () => {
  // 	it('it should delete the store', () =>
  // 		registration()
  // 			.then((tokens) => testCreateVendor(tokens))
  // 			.then(({ authTokens }) => testCreateStore(authTokens))
  // 			.then(({ responseList, authTokens }) => {
  // 				let storeIds: string[] = [];
  // 				(responseList as any[]).forEach((response) => {
  // 					const { store_id }: { store_id: string } = response;
  // 					storeIds.push(store_id);
  // 				});
  // 				return testDeleteStore(authTokens, storeIds);
  // 			}));
  // });
  // describe('/GET store', () => {
  // 	it(`it should fail to retrieve the vendor store`, () =>
  // 		registration()
  // 			.then((tokens) => testCreateVendor(tokens))
  // 			.then(({ authTokens }) => testCreateStore(authTokens))
  // 			.then(({ responseList, authTokens }) => {
  // 				let storeIds: string[] = [];
  // 				(responseList as any[]).forEach((response) => {
  // 					const { store_id }: { store_id: string } = response;
  // 					storeIds.push(store_id);
  // 				});
  // 				return testDeleteStore(authTokens, storeIds);
  // 			})
  // 			.then(({ authTokens }) => testGetNonExistentStore(authTokens)));
  // });
}
