import {
  postCustomer,
  testDeleteCustomer,
  testGetNonExistentCustomer,
} from './customer/utils/index.js'
import { UserData } from '../../../../types-and-interfaces/user.js'
import { knex } from '../../../../db/index.js'
import {
  testHasCustomerUser,
  testHasNoCustomerUser,
} from '../../helper-functions/user/index.js'

// Set server url
const server = process.env.SERVER!
let token: string

export default function ({ userInfo }: { userInfo: UserData }) {
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
      testCreateCustomer(server, token, path))

    it('it should show that the customer user has been created in the user users is_customer field', async () =>
      testHasCustomerUser(
        server,
        token,
        path.slice(0, path.lastIndexOf('customer'))
      ))

    it("it should delete the user's customer user", () =>
      testDeleteCustomer(server, token, path))

    it("it should fail to get the user's customer user", () =>
      testGetNonExistentCustomer(server, token, path))

    it('it should show that the customer user does not exist in the user users is_customer field', async () =>
      testHasNoCustomerUser(
        server,
        token,
        path.slice(0, path.lastIndexOf('customer'))
      ))
  })
}
