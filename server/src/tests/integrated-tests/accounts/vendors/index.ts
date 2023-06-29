import chai from 'chai'
import { assert } from 'chai'
import chaiHttp from 'chai-http'
import db from '../../../../db/pg/index.js'
import StoresData from '../../../../types-and-interfaces/stores-data.js'
import { UserData } from '../../../../types-and-interfaces/user.js'
import { registration } from '../../helper-functions/auth/index.js'
import {
	testCreateVendor,
	testGetVendor,
	testDeleteVendor,
	testGetNonExistentVendor,
} from '../../helper-functions/vendor/index.js'
import {
	testCreateStore,
	testGetStore,
	testUpdateStore,
	testDeleteStore,
	testGetNonExistentStore,
} from '../../helper-functions/store/index.js'

chai.use(chaiHttp).should()

const server = process.env.DEV_APP_SERVER!
let token: string

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
		// Delete all user accounts
		await db.query({ text: 'delete from user_accounts' })
		// Delete all vendors
		await db.query({ text: 'delete from vendors' })
		// Register a new user and retrieve token
		;({
			body: { token },
		} = await registration(server, userInfo))
	})

	const vendorsPath = '/v1/users/vendor-account'
	const storesPath = vendorsPath + '/stores'

	describe('Vendor account management', () => {
		it('should create a vendor account for the user', async () => {
			await testCreateVendor(server, token, vendorsPath)
		})

		it("should retrieve the user's vendor account", async () => {
			await testGetVendor(server, token, vendorsPath)
		})

		it("should delete the user's vendor account", () =>
			testDeleteVendor(server, token, vendorsPath))

		it("should fail to retrieve the user's vendor account", () => {
			testGetNonExistentVendor(server, token, vendorsPath)
		})
	})

	describe('Store management', () => {
		before(async () => {
			// Delete all vendors
			await db.query({ text: 'delete from vendors' })
			// Create a vendor account before each test
			await testCreateVendor(server, token, vendorsPath)
		})

		after(async () => {
			// Delete the vendor account after each test
			await testDeleteVendor(server, token, vendorsPath)
		})

		let storeIds: string[] = []
		it('should create a store for the vendor', async () => {
			// Create stores using store information
			for (const store of listOfStoresByVendor) {
				const { store_id } = await testCreateStore(
					server,
					token,
					storesPath,
					store
				)
				storeIds.push(store_id)
			}
		})

		it('it should fetch all the stores with a loop', async () => {
			for (const storeId of storeIds) {
				await testGetStore(server, token, storesPath + '/' + storeId)
			}
		})

		it('should update all the stores with a loop', async () => {
			assert(storeIds.length === listOfUpdatedStoresByVendor.length)
			const range = storeIds.length - 1
			for (let idx = 0; idx <= range; idx++) {
				await testUpdateStore(
					server,
					token,
					storesPath + '/' + storeIds[idx],
					listOfUpdatedStoresByVendor[idx]
				)
			}
		})

		it('should delete all the stores with a loop', async () => {
			for (const storeId of storeIds) {
				await testDeleteStore(server, token, storesPath + '/' + storeId)
			}
		})

		it('should fail to retrieve any store', async () => {
			for (const storeId of storeIds) {
				await testGetNonExistentStore(server, token, storesPath + '/' + storeId)
			}
		})
	})
}
