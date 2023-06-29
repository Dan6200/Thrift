//cspell:disable
import testAuthentication from './authentication/index.js'
import testUserAccount from './accounts/index.js'
import testCustomerAccount from './accounts/customers/index.js'
import testVendorAccount from './accounts/vendors/index.js'
import testShipping from './shipping-info/index.js'
import testProducts from './products/index.js'
import * as Ebuka from './data/users/customers/user-ebuka/index.js'
import * as Aisha from './data/users/customers/user-aisha/index.js'
import * as Mustapha from './data/users/customers/user-mustapha/index.js'
import * as Aliyu from './data/users/vendors/user-aliyu/index.js'
import db from '../../db/pg/index.js'

const users = [Ebuka, Aliyu, Aisha, Mustapha]
const customers = [Ebuka, Aisha, Mustapha]
const vendors = [Aliyu]

export default function (): void {
	/** Authentication **/

	// for (let user of users) {
	// 	const name = user.accountInfo.first_name
	// 	describe(`Testing Authentication for ${name}`, () =>
	// 		testAuthentication(user))
	// }

	/** User Account actions **/

	// 	for (let user of users) {
	// 		const name = user.accountInfo.first_name
	// 		describe(`Testing User Account for ${name}`, () => testUserAccount(user))
	// 	}

	/** Customer Account actions **/

	for (let customer of customers) {
		const name = customer.accountInfo.first_name
		describe(`Testing Customer Account for ${name}`, () =>
			testCustomerAccount(customer))
	}

	/** Shipping Info related tests **/

	// for (let customer of customers) {
	// 	const name = customer.accountInfo.first_name
	// 	describe(`Testing Shipping Information in ${name}'s account`, async () =>
	// 		testShipping(customer))
	// }

	/** Vendor Account actions **/

	// for (let vendor of vendors) {
	// 	const name = vendor.accountInfo.first_name
	// 	describe(`Testing Vendor Account for ${name}`, () =>
	// 		testVendorAccount(vendor))
	// }

	/** Product related tests **/

	// for (let vendor of vendors) {
	// 	const name = vendor.accountInfo.first_name
	// 	describe(`Testing Products listed by ${name}`, async () =>
	// 		testProducts(vendor))
	// }
}
