import chai from 'chai'
import { assert } from 'chai'
import chaiHttp from 'chai-http'
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

chai.use(chaiHttp).should()
let agent: ChaiHttp.Agent
export default function ({
	userInfo,
	stores: listOfStoresByVendor,
	updatedStores: listOfUpdatedStoresByVendor,
}: {
	userInfo: UserData
	stores: StoresData[]
	updatedStores: StoresData[]
}) {
	before(async () => {
		// Create an agent instance
		agent = chai.request.agent(process.env.LOCAL_APP_SERVER)
		// Delete all user accounts
		await db.query({ text: 'delete from user_accounts' })
		// Delete all vendors
		await db.query({ text: 'delete from vendors' })
		// Register a new user
		await registration(agent, userInfo)
	})
	beforeEach(async () => {
		// Delete all stores
		await db.query({ text: 'delete from stores' })
	})

	const vendorsPath = '/v1/user-account/vendor-account'
	const storesPath = vendorsPath + '/stores'

	describe('Vendor account management', () => {
		it('should create a vendor account for the user', async () => {
			await testCreateVendor(agent, vendorsPath)
		})

		it("should retrieve the user's vendor account", async () => {
			await testGetVendor(agent, vendorsPath)
		})

		it("should delete the user's vendor account", () =>
			testDeleteVendor(agent, vendorsPath))

		it("should fail to retrieve the user's vendor account", () => {
			testGetNonExistentVendor(agent, vendorsPath)
		})
	})

	describe('Store management', () => {
		beforeEach(async () => {
			// Create a vendor account before each test
			await testCreateVendor(agent, vendorsPath)
		})

		afterEach(async () => {
			// Delete the vendor account after each test
			await testDeleteVendor(agent, vendorsPath)
		})

		it('should create a store for the vendor', async () => {
			for (const store of listOfStoresByVendor) {
				await testCreateStore(agent, storesPath, store)
			}
		})

		it('should create then fetch the newly created store', async () => {
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
	})
}

/**
chai.use(chaiHttp).should()
let agent: ChaiHttp.Agent
export default function ({
	userInfo,
	stores: listOfStoresByVendor,
	updatedStores: listOfUpdatedStoresByVendor,
}: {
	userInfo: UserData
	stores: StoresData[]
	updatedStores: StoresData[]
}) {
	before(async () => {
		// Create an agent instance
		agent = chai.request.agent(process.env.APP_SERVER)
		// Delete all user accounts
		await db.query({ text: 'delete from user_accounts' })
		// Delete all vendors
		await db.query({ text: 'delete from vendors' })
		// Register a new user
		await registration(agent, userInfo)
	})
	beforeEach(async () => {
		// Delete all stores
		await db.query({ text: 'delete from stores' })
	})

	const vendorsPath = '/v1/user-account/vendor-account'
	const storesPath = vendorsPath + '/stores'

	it('it should create a vendor account for the user', async () => {
		await (
			testCreateVendor(agent, vendorsPath),
		)
	})

	it("it should retrieve the user's vendor account", async () => {
		await (
			testGetVendor(agent, vendorsPath),
		)
	})

	it('should create a store for the vendor', async () => {
		for (const store of listOfStoresByVendor) {
			await (
				testCreateStore(agent, storesPath, store),
			)
		}
	})

	it('should create then fetch the newly created store', async () => {
		for (const store of listOfStoresByVendor) {
			const { store_id } = await (
				testCreateStore(agent, storesPath, store),
			)
			await (
				testGetStore(agent, storesPath + '/' + store_id),
			)
		}
	})

	it('should update the store', async () => {
		assert(listOfStoresByVendor.length === listOfUpdatedStoresByVendor.length)
		const range = listOfStoresByVendor.length - 1
		for (let idx = 0; idx <= range; idx++) {
			const { store_id } = await (
				testCreateStore(agent, storesPath, listOfStoresByVendor[idx]),
			)
			await (
				testUpdateStore(
					agent,
					storesPath + '/' + store_id,
					listOfUpdatedStoresByVendor[idx]
				),
			)
		}
	})

	it('should delete the created store and fail to retrieve it', async () => {
		for (const stores of listOfStoresByVendor) {
			const { store_id } = await (
				testCreateStore(agent, storesPath, stores),
			)
			await (
				testDeleteStore(agent, storesPath + '/' + store_id),
			)
			await (
				testGetNonExistentStore(agent, storesPath + '/' + store_id),
			)
		}
	})

	it("it should delete the user's vendor account", () =>
		(
			testDeleteVendor(agent, vendorsPath),
		))

	it("it should fail to retrieve the user's vendor account", () => {
		(
			testGetNonExistentVendor(agent, vendorsPath),
		)
	})
}
**/
