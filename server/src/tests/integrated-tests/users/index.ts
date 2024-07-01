//cspell:ignore uids
import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import {
  testPostUser,
  testGetUser,
  testPatchUser,
  testDeleteUser,
  testGetNonExistentUser,
  testHasCustomerAccount,
  testHasNoCustomerAccount,
  testHasVendorAccount,
  testHasNoVendorAccount,
} from '../helper-functions/user/index.js'
import { knex } from '../../../db/index.js'
import { UserRequestData } from '../../../types-and-interfaces/user.js'
import { CreateRequestParams } from '../../../types-and-interfaces/test-routes.js'
import { auth } from '../../../auth/firebase/index.js'

chai.use(chaiHttp).should()

// Set server url
const server = process.env.SERVER!

export default function ({ user }: { user: UserRequestData }) {
  const path = '/v1/user'
  const uidsToDelete: any[] = []
  describe('User account management', () => {
    before(async () => {
      // Delete all user accounts
      await knex('users')
        .del()
        .where('email', user.email)
        .orWhere('phone', user.phone)
    })

    it('should create a new user', async () => {
      // Create a new user for each tests
      const postUserParams = {
        server,
        path,
        body: user,
      }
      if (!isValidPostUserParams(postUserParams))
        throw new Error('Invalid parameter object')
      const response = await testPostUser(postUserParams)
      console.log('response', response)
      uidsToDelete.push(response.uid)
    })

    after(async () => {
      // Delete all users from firebase auth
      console.log(uidsToDelete)
      uidsToDelete.forEach((uid) => {
        auth
          .deleteUser(uid)
          .then(() => console.log(`user with uid: ${uid} deleted`))
          .catch(() => console.error(`failed to delete user with uid ${uid}`))
      })
    })

    // it("it should get the user's account", () =>
    //   testGetUser({ server, token, path }))

    // it("it should update the user's account", () =>
    //   testUpdateAccount({server, token, path, null, updatedAccountInfo}))
    //
    // it("it should delete the user's account", () =>
    //   testDeleteAccount(server, token, path))
    //
    // it("it should fail to get user's account", () =>
    //   testGetNonExistentAccount(server, token, path))
    //
    // it('it should logout user', () => logout(server, token))
    //
    // it('it should fail to login the deleted user', () =>
    //   emailLogin(server, accountInfo, StatusCodes.UNAUTHORIZED))
  })
}

const isValidPostUserParams = (obj: unknown): obj is CreateRequestParams =>
  typeof obj === 'object' &&
  obj !== null &&
  'body' in obj &&
  'server' in obj &&
  'path' in obj
