/*
import chai from 'chai'
import chaiHttp from 'chai-http'
import { registration } from '../../helper-functions/auth/index.js'
import {
  testCreateVendor,
  testDeleteVendor,
} from '../../helper-functions/vendor/index.js'
import { AccountData } from '../../../../types-and-interfaces/account.js'
import db from '../../../../db/index.js'
import {
  testHasNoVendorAccount,
  testHasVendorAccount,
} from '../../helper-functions/user/index.js'

chai.use(chaiHttp).should()

const server = process.env.SERVER!
let token: string

export default function ({ accountInfo }: { accountInfo: AccountData }) {
  before(async () => {
    // Delete all user accounts
    await db.query({
      text: 'delete from user_accounts where email=$1 or phone=$2',
      values: [accountInfo.email, accountInfo.phone],
    })
    // Register a new user and retrieve token
    ;({
      body: { token },
    } = await registration(server, accountInfo))
  })

  const path = '/v1/account/vendor'

  describe('Vendor account management', () => {
    it('should create a vendor account for the user', async () => {
      await testCreateVendor(server, token, path)
    })

    it('it should show that the vendor account has been created in the user accounts is_vendor field', async () =>
      testHasVendorAccount(
        server,
        token,
        path.slice(0, path.lastIndexOf('vendor'))
      ))

    it("should delete the user's vendor account", () =>
      testDeleteVendor(server, token, path))

    it('it should show that the vendor account does not exist in the user accounts is_vendor field', async () =>
      testHasNoVendorAccount(
        server,
        token,
        path.slice(0, path.lastIndexOf('vendor'))
      ))
  })
}
*/
