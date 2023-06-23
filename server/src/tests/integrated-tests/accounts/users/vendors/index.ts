import assert from 'node:assert'
import db from '../../../../../db/index.js'
import StoresData from '../../../../../types-and-interfaces/stores-data.js'
import { UserData } from '../../../../../types-and-interfaces/user.js'
import { registration } from '../../../helpers/auth/index.js'
import {
	testCreateVendor,
	testGetVendor,
	testDeleteVendor,
	testGetNonExistentVendor,
} from '../../../helpers/user/vendor/index.js'
import {
	testCreateStore,
	testGetStore,
	testUpdateStore,
	testDeleteStore,
	testGetNonExistentStore,
} from '../../../helpers/user/vendor/store/index.js'

export default function (
	agent: ChaiHttp.Agent,
	{
		userInfo,
		stores: listOfStoresByVendor,
		updatedStores: listOfUpdatedStoresByVendor,
	}: {
		userInfo: UserData
		stores: StoresData[]
		updatedStores: StoresData[]
	}
) {
	before(async () => {
		await db.query({ text: 'delete from user_accounts' })
		await db.query({ text: 'delete from vendors' })
	})
	beforeEach(async () => await db.query({ text: 'delete from stores' }))

	const path = '/v1/user-account/vendor-account'
	const storesPath = path + '/stores'

	it('it should register a new user', () => registration(agent, userInfo))

	it('it should create a vendor account for the user', () =>
		testCreateVendor(agent, path))

	it("it should get the user's vendor account", () =>
		testGetVendor(agent, path))

	it('should create a store for the vendor', async () => {
		for (const store of listOfStoresByVendor) {
			await testCreateStore(agent, storesPath, store)
		}
	})

	it('should fetch the newly created store', async () => {
		for (const store of listOfStoresByVendor) {
			const { store_id } = await testCreateStore(agent, storesPath, store)
			await testGetStore(agent, storesPath + '/' + store_id)
		}
	})

	it('should update the store', async () => {
		assert(listOfStoresByVendor.length === listOfUpdatedStoresByVendor.length)
		const range = listOfStoresByVendor.length - 1
		for (let idx = 0; idx <= range; idx++) {
			const { store_id } = await testCreateStore(
				agent,
				storesPath,
				listOfStoresByVendor[idx]
			)
			await testUpdateStore(
				agent,
				storesPath + '/' + store_id,
				listOfUpdatedStoresByVendor[idx]
			)
		}
	})

	it('should delete the created store and fail to retrieve it', async () => {
		for (const stores of listOfStoresByVendor) {
			const { store_id } = await testCreateStore(agent, storesPath, stores)
			await testDeleteStore(agent, storesPath + '/' + store_id)
			await testGetNonExistentStore(agent, storesPath + '/' + store_id)
		}
	})

	it("it should delete the user's vendor account", () =>
		testDeleteVendor(agent, path))

	it("it should fail to get the user's vendor account", () =>
		testGetNonExistentVendor(agent, path))
}
