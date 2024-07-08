//cspell:ignore uids
import chai from 'chai'
import chaiHttp from 'chai-http'
import {
  testPostUser,
  testGetUser,
  testPatchUser,
  testDeleteUser,
  testGetNonExistentUser,
} from './utils/index.js'
import { knex } from '../../../db/index.js'
import { CreateRequestParams } from '../../../types-and-interfaces/test-routes.js'
import { auth as _auth } from '../../../auth/firebase/testing.js'
import { auth } from '../../../auth/firebase/index.js'
import { signInWithCustomToken } from 'firebase/auth'
import { UserRequestData } from '../../../types-and-interfaces/users/index.js'

chai.use(chaiHttp).should()

// Set server url
const server = process.env.SERVER!

export default function ({
  userInfo,
  updatedUserInfo,
}: {
  userInfo: UserRequestData
  updatedUserInfo: UserRequestData
}) {
  const path = '/v1/users'
  let uidToDelete: string = ''
  let token: string = ''
  describe('User account management', () => {
    it('should create a new user', async () => {
      // Create a new user for each tests
      const postUserParams = {
        server,
        path,
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

    it("it should get the user's account", () =>
      testGetUser({ server, token, path }))

    it("it should update the user's account", () =>
      testPatchUser({
        server,
        token,
        path,
        query: undefined,
        body: updatedUserInfo,
      }))

    it("it should delete the user's account", () =>
      testDeleteUser({ server, token, path }))

    it("it should fail to get user's account", () =>
      testGetNonExistentUser({ server, token, path }))

    after(async () => {
      // Delete users from db
      if (uidToDelete) await knex('users').where('uid', uidToDelete).del()
      // Delete all users from firebase auth
      await auth
        .deleteUser(uidToDelete)
        .catch((error) =>
          console.error(
            `failed to delete user with uid ${uidToDelete}: ${error}`
          )
        )
    })
  })
}

export const isValidPostUserParams = (
  obj: unknown
): obj is CreateRequestParams =>
  typeof obj === 'object' &&
  obj !== null &&
  'body' in obj &&
  'server' in obj &&
  'path' in obj
