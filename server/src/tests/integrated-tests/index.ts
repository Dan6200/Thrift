//cspell:disable
import chai from 'chai'
import app from '../../app.js'
import testAuthentication from '../authentication/index.js'
import testUserAccount from '../accounts/users/index.js'
import testCustomerAccount from '../accounts/users/customers/index.js'
import testVendorAccount from '../accounts/users/vendors/index.js'
// import testProducts from '../accounts/users/vendors/products/index.js'
import * as Ebuka from '../data/users/customers/user-ebuka/index.js'
import * as Aisha from '../data/users/customers/user-aisha/index.js'
import * as Mustapha from '../data/users/customers/user-mustapha/index.js'
import * as Aliyu from '../data/users/vendors/user-aliyu/index.js'
import db from '../../db/index.js'

const users = [Ebuka, Aliyu, Aisha, Mustapha]
const customers = [Ebuka, Aisha, Mustapha]
const vendors = [Aliyu]

export default function (): void {
	// Testing the register route
	describe(`Testing typical user actions`, async () => {
		before(() => db.query('delete from user_accounts'))
		// const url = 'https://thrift-dev.up.railway.app'
		const url = 'localhost:1024'
		const agent = chai.request.agent(url)
		// const agent = chai.request.agent(app)

		for (let user of users) {
			describe('Testing Authentication', () => testAuthentication(agent, user))
			describe('Testing User Account', () => testUserAccount(agent, user))
		}
		for (let vendor of vendors) {
			describe('Testing Vendor Account', () => testVendorAccount(agent, vendor))
			// describe('Testing Products', async () => testProducts(agent, user))
		}
		for (let customer of customers)
			describe('Testing Customer Account', () =>
				testCustomerAccount(agent, customer))
	})
}
