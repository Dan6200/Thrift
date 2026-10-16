import StoreData from '#src/types/store-data.js'
import {
  testCreateStore,
  testGetStore,
  testUpdateStore,
  testGetAllStores,
  testDeleteStore,
  testGetNonExistentStore,
} from '../stores/definitions/index.js'
import assert from 'assert'
import { ProfileRequestData } from '../../../types/profile/index.js'
import { deleteUserForTesting } from '../helpers/delete-user.js'
import { createUserForTesting } from '../helpers/create-user.js'
import { signInForTesting } from '../helpers/signin-user.js'
import { testHasVendorAccount } from '../profiles/definitions.js'

export default function ({
  userInfo,
  stores,
  updatedStores,
}: {
  userInfo: ProfileRequestData
  stores: StoreData[]
  updatedStores: StoreData[]
}) {
  // Each test seeds its own vendor so no test depends on state left behind by
  // another.
  const withVendor = async (fn: (token: string) => Promise<void>) => {
    const userId = await createUserForTesting(userInfo)
    const token = await signInForTesting(userInfo)
    try {
      await fn(token)
    } finally {
      await deleteUserForTesting(userId)
    }
  }

  const createAll = async (token: string): Promise<number[]> => {
    assert(!!stores.length)
    const ids: number[] = []
    for (const store of stores) {
      const { store_id } = await testCreateStore({
        token,
        body: store,
        expectedData: store,
      })
      ids.push(store_id)
    }
    return ids
  }

  it("should have a vendor's account", () =>
    withVendor(async (token) => {
      await testHasVendorAccount({ token, expectedData: userInfo })
    }))

  it('should create a store for the vendor', () =>
    withVendor(async (token) => {
      assert(!!stores.length)
      for (const store of stores) {
        await testCreateStore({ token, body: store, expectedData: store })
      }
    }))

  it('should fetch all the stores with one request', () =>
    withVendor(async (token) => {
      await createAll(token)
      await testGetAllStores({ token })
    }))

  it('should fetch all the stores with a loop', () =>
    withVendor(async (token) => {
      const storeIds = await createAll(token)
      assert(!!storeIds.length)
      for (const [idx, storeId] of storeIds.entries()) {
        await testGetStore({
          token,
          params: { storeId },
          expectedData: stores[idx],
        })
      }
    }))

  it('should update all the stores with a loop', () =>
    withVendor(async (token) => {
      const storeIds = await createAll(token)
      assert(!!storeIds.length && storeIds.length === updatedStores.length)
      for (const [idx, storeId] of storeIds.entries()) {
        await testUpdateStore({
          token,
          params: { storeId },
          body: updatedStores[idx],
          expectedData: updatedStores[idx],
        })
      }
    }))

  it('should delete all the stores with a loop', () =>
    withVendor(async (token) => {
      const storeIds = await createAll(token)
      for (const storeId of storeIds) {
        await testDeleteStore({ token, params: { storeId } })
      }
    }))

  it('should fail to retrieve any store', () =>
    withVendor(async (token) => {
      const storeIds = await createAll(token)
      for (const storeId of storeIds) {
        await testDeleteStore({ token, params: { storeId } })
      }
      for (const storeId of storeIds) {
        await testGetNonExistentStore({ token, params: { storeId } })
      }
    }))
}
