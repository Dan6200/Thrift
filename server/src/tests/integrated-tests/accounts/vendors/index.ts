import chai from 'chai'
import chaiHttp from 'chai-http'
import db from '../../../../db/pg/index.js'
import { registration } from '../../helper-functions/auth/index.js'
import {
	testCreateVendor,
	testGetVendor,
	testDeleteVendor,
	testGetNonExistentVendor,
} from '../../helper-functions/vendor/index.js'
import { AccountData } from '../../../../types-and-interfaces/account.js'

chai.use(chaiHttp).should()

const server = process.env.LOCAL_APP_SERVER!
let token: string

export default function ({ accountInfo }: { accountInfo: AccountData }) {
	before(async () => {
		// Delete all user accounts
		await db.query({ text: 'delete from user_accounts' })
		// Delete all vendors
		await db.query({ text: 'delete from vendors' })
		// Register a new user and retrieve token
		;({
			body: { token },
		} = await registration(server, accountInfo))
	})

	const vendorsPath = '/v1/account/vendor'

	describe('Vendor account management', () => {
		it('should create a vendor account for the user', async () => {
			await testCreateVendor(server, token, vendorsPath)
		})

		it("should retrieve the user's vendor account", async () => {
			await testGetVendor(server, token, vendorsPath)
		})

		it("should delete the user's vendor account", () =>
			testDeleteVendor(server, token, vendorsPath))

		it("should fail to retrieve the user's vendor account", () => {
			testGetNonExistentVendor(server, token, vendorsPath)
		})
	})
}
