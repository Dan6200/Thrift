//cspell:disable
import chai from 'chai'
import testAuthentication from './authentication/index.js'
import testUserAccount from './accounts/users/index.js'
import testCustomerAccount from './accounts/users/customers/index.js'
import testVendorAccount from './accounts/users/vendors/index.js'
import testProducts from './accounts/users/vendors/products/index.js'
import * as Ebuka from './data/users/customers/user-ebuka/index.js'
import * as Aisha from './data/users/customers/user-aisha/index.js'
import * as Mustapha from './data/users/customers/user-mustapha/index.js'
import * as Aliyu from './data/users/vendors/user-aliyu/index.js'
import db from '../../db/index.js'

const users = [Ebuka, Aliyu, Aisha, Mustapha]
const customers = [Ebuka, Aisha, Mustapha]
const vendors = [Aliyu]

export default function (): void {
	// Testing the register route
	before(() => db.query({ text: 'delete from user_accounts' }))
	// const url = 'https://thrift-dev.up.railway.app'
	const url = 'localhost:1024'
	const agent = chai.request.agent(url)
	// const agent = chai.request.agent(app)

	for (let user of users) {
		const name = user.userInfo.first_name
		describe(`Testing Authentication for ${name}`, () =>
			testAuthentication(agent, user))
	}
	for (let user of users) {
		const name = user.userInfo.first_name
		describe(`Testing User Account for ${name}`, () =>
			testUserAccount(agent, user))
	}
	for (let customer of customers) {
		const name = customer.userInfo.first_name
		describe(`Testing Customer Account for ${name}`, () =>
			testCustomerAccount(agent, customer))
	}
	for (let vendor of vendors) {
		const name = vendor.userInfo.first_name
		describe(`Testing Vendor Account for ${name}`, () =>
			testVendorAccount(agent, vendor))
	}
	for (let vendor of vendors) {
		const name = vendor.userInfo.first_name
		describe(`Testing Products listed by ${name}`, async () =>
			testProducts(agent, vendor))
	}
}
