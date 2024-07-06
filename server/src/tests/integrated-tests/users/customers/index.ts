import { testPostCustomer, testDeleteCustomer } from './utils/index.js'
import { UserRequestData } from '../../../../types-and-interfaces/users/index.js'
import {
  testHasCustomerAccount,
  testHasNoCustomerAccount,
  testPostUser,
} from '../../users/utils/index.js'
import { auth } from '../../../../auth/firebase/index.js'
import { auth as _auth } from '../../../../auth/firebase/testing.js'
import { isValidPostUserParams } from '../index.js'
import { signInWithCustomToken } from 'firebase/auth'
import { knex } from '../../../../db/index.js'

// Set server url
const server = process.env.SERVER!

export default function ({ userInfo }: { userInfo: UserRequestData }) {
  describe('Customer account management', () => {
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

    const path = '/v1/users/customers'
    let uidToDelete: string = ''
    let token: string

    it('it should create a customer user for the user', () =>
      testPostCustomer({ server, token, path }))

    after(async () => {
      // Delete users from db
      await knex('users').where('uid', uidToDelete).del()
      // Delete all users from firebase auth
      await auth
        .deleteUser(uidToDelete)
        .catch((error) =>
          console.error(
            `failed to delete user with uid ${uidToDelete}: ${error}`
          )
        )
    })

    it("it should show that the customer account has been created in the user's is_customer field", async () =>
      testHasCustomerAccount({
        server,
        token,
        path: '/v1/users',
      }))

    it("it should delete the user's customer account", () =>
      testDeleteCustomer({ server, token, path }))

    it("it should show that the customer account does not exist in the user's is_customer field", async () =>
      testHasNoCustomerAccount({
        server,
        token,
        path: '/v1/users',
      }))
  })
}
