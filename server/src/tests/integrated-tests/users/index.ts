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

chai.use(chaiHttp).should()

// Set server url
const server = process.env.SERVER!

export default function ({
  token,
  user,
  updatedUser,
}: {
  token: string // from firebase
  user: UserRequestData
  updatedUser: UserRequestData
}) {
  const path = '/v1/user'
  describe('User account management', () => {
    before(async () => {
      // Delete all user accounts
      await knex('users')
        .del()
        .where('email', user.email)
        .orWhere('phone', user.phone)
      // Create a new user for each tests
      const response = await testPostUser<UserRequestData>({
        server,
        token,
        path,
        body: user,
      })
    })

    it("it should get the user's account", () =>
      testGetUser({ server, token, path }))

    it("it should update the user's account", () =>
      testUpdateAccount(server, token, path, null, updatedAccountInfo))

    it("it should change the user's password", () =>
      testChangeAccountPassword(
        server,
        token,
        path + '/password',
        null,
        updatedPassword
      ))

    it("it should delete the user's account", () =>
      testDeleteAccount(server, token, path))

    it("it should fail to get user's account", () =>
      testGetNonExistentAccount(server, token, path))

    it('it should logout user', () => logout(server, token))

    it('it should fail to login the deleted user', () =>
      emailLogin(server, accountInfo, StatusCodes.UNAUTHORIZED))
  })
}
