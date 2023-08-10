//cspell:disable
import testAuthentication from './authentication/index.js'
import testUserAccount from './accounts/index.js'
import testCustomerAccount from './accounts/customers/index.js'
import testVendorAccount from './accounts/vendors/index.js'
import testStores from './stores/index.js'
import testShipping from './shipping-info/index.js'
import testProducts from './products/index.js'
import testPublicProducts from './public/products/index.js'
import testMedia from './media/index.js'
import * as Ebuka from './data/users/customers/user-ebuka/index.js'
import * as Aisha from './data/users/customers/user-aisha/index.js'
import * as Mustapha from './data/users/customers/user-mustapha/index.js'
import * as Aliyu from './data/users/vendors/user-aliyu/index.js'

const users = [Ebuka, Aliyu, Aisha, Mustapha]
const customers = [Ebuka, Aisha, Mustapha]
const vendors = [Aliyu]

export default function (): void {
  /** Public Routes **/

  /** Products **/

  for (let vendor of vendors) {
    const name = vendor.accountInfo.first_name
    describe(`Testing Public Routes for ${name}`, () =>
      testPublicProducts(vendor))
  }

  /** Authentication **/

  for (let user of users) {
    const name = user.accountInfo.first_name
    describe(`Testing Authentication for ${name}`, () =>
      testAuthentication(user))
  }

  /** Private Routes **/

  /** User Account actions **/

  for (let user of users) {
    const name = user.accountInfo.first_name
    describe(`Testing User Account for ${name}`, () => testUserAccount(user))
  }

  /** Customer Account actions **/

  for (let customer of customers) {
    const name = customer.accountInfo.first_name
    describe(`Testing Customer Account for ${name}`, () =>
      testCustomerAccount(customer))
  }

  /** Shipping Info related tests **/

  for (let customer of customers) {
    const name = customer.accountInfo.first_name
    describe(`Testing the Shipping Information of ${name}'s account`, async () =>
      testShipping(customer))
  }

  /** Vendor Account actions **/

  for (let vendor of vendors) {
    const name = vendor.accountInfo.first_name
    describe(`Testing Vendor Account for ${name}`, () =>
      testVendorAccount(vendor))
  }

  /** Stores related tests **/

  for (let vendor of vendors) {
    const name = vendor.accountInfo.first_name
    describe(`Testing Stores owned by ${name}`, () => testStores(vendor))
  }

  /** Product related tests **/

  for (let vendor of vendors) {
    const name = vendor.accountInfo.first_name
    describe(`Testing Products listed by ${name}`, async () =>
      testProducts(vendor))
  }

  /** Media related tests **/

  for (let vendor of vendors) {
    describe(`Testing Media for Different Products`, async () =>
      testMedia(vendor))
  }

  // end
}
