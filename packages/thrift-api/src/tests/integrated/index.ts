//cspell:disable
import testProfile from './profiles/index.js'
import testProfileWithoutSignIn from './profiles/no-signin.js'
import testStoresWithNoAccess from './stores/no-access.js'
import testStores from './stores/index.js'
import testDelivery from './delivery-info/index.js'
import testProducts from './products/index.js'
import testMedia from './media/index.js'
import { loadUserData } from './helpers/load-data.js'
import testAnalytics from './analytics/index.js'
import testStoreStaff from './store_staff/index.js'
import testCart from './cart/index.js'
import testProductReviews from './reviews/products/index.js'
import testOrders from './orders/index.js'
import { bulkDeleteImages } from './utils/bulk-delete.js'
import adversarialTests from './adversarial/index.js'

const Ebuka = loadUserData(
  'src/tests/integrated/data/users/customers/user-ebuka',
)
const Aisha = loadUserData(
  'src/tests/integrated/data/users/customers/user-aisha',
)
const Mustapha = loadUserData(
  'src/tests/integrated/data/users/customers/user-mustapha',
)
const Aliyu = loadUserData('src/tests/integrated/data/users/vendors/user-aliyu')

const users = [Ebuka, Aliyu, Aisha, Mustapha]
const customers = [Ebuka, Aisha, Mustapha] // is_customer is true
const vendors = [Aliyu] // is_vendor is true

export default function (): void {
  /** User Account actions **/

  for (let user of users) {
    const { userInfo } = user
    const { first_name: name } = userInfo
    describe(`Testing retrieving user Profile for ${name} (All users)`, () =>
      testProfile(user as any))
    describe(`Testing retrieving user Profile without Signing In (All users)`, () =>
      testProfileWithoutSignIn(user as any))
  }

  /** Delivery Info related tests **/

  for (let customer of customers) {
    const { userInfo } = customer
    const { first_name: name } = userInfo
    describe(`Testing the Delivery Information of ${name}'s (Customer) account`, async () =>
      testDelivery(customer as any))
  }

  /** Stores related tests **/

  for (let vendor of vendors) {
    const { userInfo } = vendor
    const { first_name: name } = userInfo
    describe(`Testing Stores owned by ${name} (Vendor)`, () =>
      testStores({
        userInfo: vendor.userInfo,
        stores: vendor.listOfStores,
        updatedStores: vendor.updatedStores,
      }))
  }

  for (let vendor of vendors) {
    describe(`Testing Store access without a vendor account`, () =>
      testStoresWithNoAccess({
        vendorInfo: vendor.userInfo,
        nonVendorInfo: customers[0].userInfo,
        stores: vendor.listOfStores,
        updatedStores: vendor.updatedStores,
      }))
  }

  /** Cart related tests **/
  for (let customer of customers) {
    const { userInfo } = customer
    const { first_name: name } = userInfo
    describe(`Testing Cart for ${name} (Customer)`, () =>
      testCart(customer as any))
  }

  /** Product related tests **/

  for (let vendor of vendors) {
    const { userInfo } = vendor
    const { first_name: name } = userInfo
    describe(`Testing Products listed by ${name} (Vendor)`, async () =>
      testProducts(vendor))
  }

  /** Dashboard related tests **/

  for (let vendor of vendors) {
    const { userInfo } = vendor
    const { first_name: name } = userInfo
    describe(`Testing Dashboard Analytics for ${name} (Vendor)`, () =>
      testAnalytics(vendor as any))
  }

  /** Store Staff related tests **/

  for (let vendor of vendors) {
    for (let customer of customers) {
      const { userInfo: vendorInfo } = vendor
      const { userInfo: customerInfo } = customer
      const { first_name: vendorName } = vendorInfo
      const { first_name: customerName } = customerInfo
      describe(`Testing Store Staff for ${vendorName} (Vendor) with staff ${customerName} (Customer)`, () =>
        testStoreStaff({ vendorInfo, customerInfo }))
    }
  }

  /** Order related tests **/
  for (let customer of customers) {
    const { userInfo } = customer
    const { first_name: name } = userInfo
    describe(`Testing Orders for ${name} (Customer)`, () =>
      testOrders(customer as any))
  }

  /** Product Reviews related tests **/
  for (let customer of customers) {
    const { userInfo } = customer
    const { first_name: name } = userInfo
    describe(`Testing Product Reviews for ${name} (Customer)`, () =>
      testProductReviews(customer as any))
  }

  /** Media related tests **/

  for (let user of users) {
    describe(`Testing Media File Upload for ${user.userInfo.first_name} (All Users)`, () =>
      testMedia(user as any))
  }

  /** Media cleanup runs once after every integrated test completes. **/
  after(async () => {
    await Promise.all([
      bulkDeleteImages('avatars'),
      bulkDeleteImages('products'),
    ])
  })

  /** Strict adversarial contract tests **/

  describe('Testing adversarial contract invariants', () => adversarialTests())
  // end
}
