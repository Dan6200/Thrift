import 'dotenv'
import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import {
  registration,
  logout,
  emailLogin,
} from '../helper-functions/auth/index.js'
import {
  testGetAccount,
  testUpdateAccount,
  testChangeAccountPassword,
  testDeleteAccount,
  testGetNonExistentAccount,
} from '../helper-functions/user/index.js'
import { AccountData } from '../../../types-and-interfaces/account.js'
import db from '../../../db/index.js'

chai.use(chaiHttp).should()

// Set server url
const server = process.env.LOCAL_APP_SERVER!

export default function ({
  accountInfo,
  updatedAccountInfo,
  updatedPassword,
}: {
  accountInfo: AccountData
  updatedAccountInfo: AccountData
  updatedPassword: AccountData
}) {
  const path = '/v1/account'
  let token: string
  describe('User account management', () => {
    before(async () => {
      // Delete all user accounts
      await db.query({
        text: 'delete from user_accounts where email=$1 or phone=$2',
        values: [accountInfo.email, accountInfo.phone],
      })
      // Create a new user for each tests
      const response = await registration(server, accountInfo)
      // Store the token returned
      token = response.body.token
    })

    it("it should get the user's account", () =>
      testGetAccount(server, token, path))

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
