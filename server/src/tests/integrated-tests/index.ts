//cspell:disable
import chai from 'chai'
import app from '../../app.js'
import testAuthentication from '../authentication/index.js'
import testUserAccount from '../accounts/users/index.js'
import testCustomerAccount from '../accounts/users/customers/index.js'
import testVendorAccount from '../accounts/users/vendors/index.js'
import testProducts from '../accounts/users/vendors/products/index.js'
import * as Ebuka from '../data/users/user-ebuka/index.js'
import * as Aisha from '../data/users/user-aisha/index.js'
import * as Mustapha from '../data/users/user-mustapha/index.js'
const users = [Ebuka, Aisha, Mustapha]

export default function (): void {
	// Testing the register route
	describe(`Testing typical user actions`, async () => {
		// const url = 'https://thrift-dev.up.railway.app'
		const url = 'localhost:1024'
		const agent = chai.request.agent(url)
		// const agent = chai.request.agent(app)

		for (let user of users) {
			describe('Testing Authentication', () => testAuthentication(agent, user))
			describe('Testing User Account', () => testUserAccount(agent, user))
			describe('Testing Customer Account', () =>
				testCustomerAccount(agent, user))
			describe('Testing Vendor Account', () => testVendorAccount(agent, user))
			describe('Testing Products', async () => testProducts(agent, user))
		}
	})
}
