import { registration } from '../../helper-functions/auth/index.js'
import {
  testCreateCustomer,
  testDeleteCustomer,
  testGetNonExistentCustomer,
} from '../../helper-functions/user/customer/index.js'
import db from '../../../../db/pg/index.js'
import { AccountData } from '../../../../types-and-interfaces/account.js'

// Set server url
const server = process.env.LOCAL_APP_SERVER!
let token: string

export default function ({ accountInfo }: { accountInfo: AccountData }) {
  before(async () => {
    await db.query({
      text: 'delete from user_accounts where email=$1 or phone=$2',
      values: [accountInfo.email, accountInfo.phone],
    })
    ;({
      body: { token },
    } = await registration(server, accountInfo))
  })
  after(async function () {
    await db.query({
      text: 'delete from user_accounts where email=$1 or phone=$2',
      values: [accountInfo.email, accountInfo.phone],
    })
  })

  const path = '/v1/account/customer'

  describe('Customer Account', () => {
    after(async function () {
      await db.query({
        text: 'delete from user_accounts where email=$1 or phone=$2',
        values: [accountInfo.email, accountInfo.phone],
      })
    })

    it('it should create a customer account for the user', () =>
      testCreateCustomer(server, token, path))

    it("it should delete the user's customer account", () =>
      testDeleteCustomer(server, token, path))

    it("it should fail to get the user's customer account", () =>
      testGetNonExistentCustomer(server, token, path))
  })
}
