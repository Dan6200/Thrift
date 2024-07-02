import { testPostCustomer, testDeleteCustomer } from './utils/index.js'
import { UserRequestData } from '../../../../types-and-interfaces/users/index.js'
import { knex } from '../../../../db/index.js'
import {
  testHasCustomerAccount,
  testHasNoCustomerAccount,
} from '../../users/utils/index.js'

// Set server url
const server = process.env.SERVER!
let token: string

export default function ({ userInfo }: { userInfo: UserRequestData }) {
  describe('Customer account management', () => {
    before(async () => {
      // Delete all user accounts
      await knex('users')
        .del()
        .where('email', userInfo.email)
        .orWhere('phone', userInfo.phone)
    })

    const path = '/v1/user/customer'

    it('it should create a customer user for the user', () =>
      testPostCustomer({ server, token, path }))

    it('it should show that the customer account has been created with is_customer field', async () =>
      testHasCustomerAccount({
        server,
        token,
        path.slice(0, path.lastIndexOf('customer'))}
      ))

    it("it should delete the user's customer user", () =>
      testDeleteCustomer({server, token, path}))

    it("it should fail to get the user's customer user", () =>
      testGetNonExistentCustomer({server, token, path}))

    it('it should show that the customer user does not exist in the user users is_customer field', async () =>
      testHasNoCustomerAccount({
        server,
        token,
        path.slice(0, path.lastIndexOf('customer'))}
      ))
  })
}
