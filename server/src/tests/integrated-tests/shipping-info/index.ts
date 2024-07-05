import ShippingInfo from '../../../types-and-interfaces/shipping-info.js'
import { auth } from '../../../auth/firebase/index.js'
import { auth as _auth } from '../../../auth/firebase/testing.js'
import {
  testPostCustomer,
  testDeleteCustomer,
} from '../users/customers/utils/index.js'
import {
  testCreateShipping,
  testGetShipping,
  testUpdateShipping,
  testDeleteShipping,
  testGetNonExistentShipping,
} from '../shipping-info/utils/index.js'
import assert from 'assert'
import { knex } from '../../../db/index.js'
import { UserRequestData } from '../../../types-and-interfaces/users/index.js'
import { isValidPostUserParams } from '../users/index.js'
import { testPostUser } from '../users/utils/index.js'
import { signInWithCustomToken } from 'firebase/auth'

// Set server url
const server = process.env.SERVER!
let token: string

export default function ({
  userInfo,
  listOfShippingInfo,
  listOfUpdatedShippingInfo,
}: {
  userInfo: UserRequestData
  listOfShippingInfo: ShippingInfo[]
  listOfUpdatedShippingInfo: ShippingInfo[]
}) {
  before(async () => {
    // Create a new user for each tests
    const postUserParams = {
      server,
      path: '/v1/users',
      body: userInfo,
    }
    if (!isValidPostUserParams(postUserParams))
      throw new Error('Invalid parameter object')
    const response = await testPostUser(postUserParams)
    uidToDelete = response.uid
    const customToken = await auth.createCustomToken(response.uid)
    token = await signInWithCustomToken(_auth, customToken).then(({ user }) =>
      user.getIdToken()
    )
  })

  after(async function () {
    // Delete all users from firebase auth
    await auth
      .deleteUser(uidToDelete)
      .catch((error) =>
        console.error(`failed to delete user with uid ${uidToDelete}: ${error}`)
      )
  })

  const shippingPath = '/v1/shipping-info'
  let uidToDelete = ''

  const shippingIds: number[] = []

  it(`it should add multiple shipping addresses for the customer`, async () => {
    for (const shippingInfo of listOfShippingInfo) {
      const { shipping_info_id } = await testCreateShipping(
        server,
        token,
        shippingPath,
        null,
        shippingInfo
      )
      shippingIds.push(shipping_info_id)
    }
  })

  it('it should retrieve all shipping information through a loop', async () => {
    for (const shippingId of shippingIds) {
      await testGetShipping(server, token, shippingPath + '/' + shippingId)
    }
  })

  it(`it should update all shipping addresses for the customer`, async () => {
    assert(shippingIds.length === listOfUpdatedShippingInfo.length)
    let idx: number, shippingId: number
    for ([idx, shippingId] of shippingIds.entries()) {
      await testUpdateShipping(
        server,
        token,
        shippingPath + '/' + shippingId,
        null,
        listOfUpdatedShippingInfo[idx]
      )
    }
  })

  it(`it should delete all shipping addresses for the customer`, async () => {
    for (const shippingId of shippingIds) {
      await testDeleteShipping(server, token, shippingPath + '/' + shippingId)
    }
  })

  it(`it should fail to retrieve any of the deleted shipping information`, async () => {
    for (const shippingId of shippingIds) {
      await testGetNonExistentShipping(
        server,
        token,
        `${shippingPath}/${shippingId}`
      )
    }
  })
}
