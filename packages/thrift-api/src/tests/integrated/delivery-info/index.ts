import {
  testCreateDelivery,
  testGetAllDelivery,
  testGetDelivery,
  testUpdateDelivery,
  testDeleteDelivery,
  testGetNonExistentDelivery,
} from '../delivery-info/definitions/index.js'
import assert from 'assert'
import { ProfileRequestData } from '../../../types/profile/index.js'
import { deleteUserForTesting } from '../helpers/delete-user.js'
import { createUserForTesting } from '../helpers/create-user.js'
import { signInForTesting } from '../helpers/signin-user.js'
import { testHasCustomerAccount } from '../profiles/definitions.js'
import { DeliveryInfo } from '#src/types/delivery-info.js'

export default function ({
  userInfo,
  listOfDeliveryInfo,
  listOfUpdatedDeliveryInfo,
}: {
  userInfo: ProfileRequestData
  listOfDeliveryInfo: DeliveryInfo[]
  listOfUpdatedDeliveryInfo: DeliveryInfo[]
}) {
  // Each test gets a fresh customer so no test depends on state left behind
  // by another.
  const withCustomer = async (fn: (token: string) => Promise<void>) => {
    const userId = await createUserForTesting(userInfo)
    const token = await signInForTesting(userInfo)
    try {
      await fn(token)
    } finally {
      await deleteUserForTesting(userId)
    }
  }

  const createAll = async (token: string): Promise<number[]> => {
    const ids: number[] = []
    for (const body of listOfDeliveryInfo) {
      const { delivery_info_id } = await testCreateDelivery({
        body,
        token,
        expectedData: body,
      })
      ids.push(delivery_info_id)
    }
    return ids
  }

  it("should have a customer's account", () =>
    withCustomer(async (token) => {
      await testHasCustomerAccount({ token, expectedData: userInfo })
    }))

  it('should add multiple delivery addresses for the customer', () =>
    withCustomer(async (token) => {
      assert(!!listOfDeliveryInfo.length)
      for (const body of listOfDeliveryInfo) {
        await testCreateDelivery({ body, token, expectedData: body })
      }
    }))

  it('should retrieve all delivery information at once', () =>
    withCustomer(async (token) => {
      await createAll(token)
      await testGetAllDelivery({ token })
    }))

  it('should retrieve all delivery information through a loop', () =>
    withCustomer(async (token) => {
      const deliveryIds = await createAll(token)
      assert(!!deliveryIds.length)
      for (const [idx, deliveryId] of deliveryIds.entries()) {
        await testGetDelivery({
          token,
          params: { deliveryInfoId: deliveryId },
          expectedData: listOfDeliveryInfo[idx],
        })
      }
    }))

  it('should update all delivery addresses for the customer', () =>
    withCustomer(async (token) => {
      const deliveryIds = await createAll(token)
      assert(
        !!deliveryIds.length &&
          deliveryIds.length === listOfUpdatedDeliveryInfo.length,
      )
      for (const [idx, deliveryId] of deliveryIds.entries()) {
        const body = { ...listOfUpdatedDeliveryInfo[idx] }
        await testUpdateDelivery({
          token,
          params: { deliveryInfoId: deliveryId },
          body,
          expectedData: body,
        })
      }
    }))

  it('should delete all delivery addresses for the customer', () =>
    withCustomer(async (token) => {
      const deliveryIds = await createAll(token)
      assert(!!deliveryIds.length)
      for (const deliveryId of deliveryIds) {
        await testDeleteDelivery({
          token,
          params: { deliveryInfoId: deliveryId },
        })
      }
    }))

  it('should fail to retrieve any of the deleted delivery information', () =>
    withCustomer(async (token) => {
      const deliveryIds = await createAll(token)
      assert(!!deliveryIds.length)
      for (const deliveryId of deliveryIds) {
        await testDeleteDelivery({
          token,
          params: { deliveryInfoId: deliveryId },
        })
      }
      for (const deliveryId of deliveryIds) {
        await testGetNonExistentDelivery({
          token,
          params: { deliveryInfoId: deliveryId },
        })
      }
    }))
}
