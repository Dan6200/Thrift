import {
	testCreateCustomer,
	testGetCustomer,
	testDeleteCustomer,
	testGetNonExistentCustomer,
} from '../../../helpers/user/customer/index.js'
import {
	testCreateShipping,
	testGetShipping,
	testUpdateShipping,
	testDeleteShipping,
	testGetNonExistentShipping,
} from '../../../helpers/user/customer/shipping.js'
import { registration } from '../../../helpers/auth/index.js'
import assert from 'node:assert'
import db from '../../../../../db/index.js'
import ShippingInfo from '../../../../../types-and-interfaces/shipping-info.js'
import { UserData } from '../../../../../types-and-interfaces/user.js'

// Set server url
const server = process.env.LOCAL_APP_SERVER!
let token: string

export default function ({
	userInfo,
	listOfShippingInfo,
	listOfUpdatedShippingInfo,
}: {
	userInfo: UserData
	listOfShippingInfo: ShippingInfo[]
	listOfUpdatedShippingInfo: ShippingInfo[]
}) {
	before(async () => {
		await db.query({ text: 'delete from user_accounts' })
		await db.query({ text: 'delete from customers' })
		;({
			body: { token },
		} = await registration(server, userInfo))
	})
	beforeEach(async () => {
		await db.query({ text: 'delete from shipping_info' })
	})

	const path = '/v1/user-account/customer-account'

	describe('Customer Account', () => {
		it('it should create a customer account for the user', () =>
			testCreateCustomer(server, token, path))

		it("it should get the user's customer account", () =>
			testGetCustomer(server, token, path))

		it("it should delete the user's customer account", () =>
			testDeleteCustomer(server, token, path))

		it("it should fail to get the user's customer account", () =>
			testGetNonExistentCustomer(server, token, path))
	})

	describe('Shipping Addresses', () => {
		const shippingPath = path + '/shipping'

		it(`it should add shipping addresses for the customer then retrieve it`, async () => {
			for (const shippingInfo of listOfShippingInfo) {
				const { address_id } = await testCreateShipping(
					server,
					token,
					shippingPath,
					shippingInfo
				)
				await testGetShipping(server, token, shippingPath + '/' + address_id)
			}
		})

		it(`it should add a shipping addresses for the customer then update it`, async () => {
			assert(listOfShippingInfo.length === listOfUpdatedShippingInfo.length)
			for (let idx = 0; idx < listOfShippingInfo.length; idx++) {
				const { address_id } = await testCreateShipping(
					server,
					token,
					shippingPath,
					listOfShippingInfo[idx]
				)
				await testUpdateShipping(
					server,
					token,
					shippingPath + '/' + address_id,
					listOfUpdatedShippingInfo[idx]
				)
			}
		})

		it(`it should add a shipping addresses for the customer then delete it`, async () => {
			for (const shippingInfo of listOfShippingInfo) {
				const { address_id } = await testCreateShipping(
					server,
					token,
					shippingPath,
					shippingInfo
				)
				await testDeleteShipping(server, token, shippingPath + '/' + address_id)
			}
		})

		it(`it should fail to retrieve the deleted shipping information`, async () => {
			for (const shippingInfo of listOfShippingInfo) {
				const { address_id } = await testCreateShipping(
					server,
					token,
					shippingPath,
					shippingInfo
				)
				await testDeleteShipping(server, token, `${shippingPath}/${address_id}`)
				await testGetNonExistentShipping(
					server,
					token,
					`${shippingPath}/${address_id}`
				)
			}
		})
	})
}

/**
export default function ({
	userInfo,
	listOfShippingInfo,
	listOfUpdatedShippingInfo,
}: {
	userInfo: UserData
	listOfShippingInfo: ShippingInfo[]
	listOfUpdatedShippingInfo: ShippingInfo[]
}) {
	before(async () => {
		await db.query({ text: 'delete from user_accounts' })
		await db.query({ text: 'delete from customers' })
		;({
			body: { token },
		} = await registration(server, userInfo))
	})
	beforeEach(async () => {
		await db.query({ text: 'delete from shipping_info' })
	})

	const path = '/v1/user-account/customer-account'

	it('it should create a customer account for the user', () =>
		testCreateCustomer(server, token, path))

	it("it should get the user's customer account", () =>
		testGetCustomer(server, token, path))

	const shippingPath = path + '/shipping'

	it(`it should add shipping addresses for the customer then retrieve it`, async () => {
		for (const shippingInfo of listOfShippingInfo) {
			const { address_id } = await testCreateShipping(
				server,
				token,
				shippingPath,
				shippingInfo
			)
			await testGetShipping(server, token, shippingPath + '/' + address_id)
		}
	})

	it(`it should add a shipping addresses for the customer then update it`, async () => {
		assert(listOfShippingInfo.length === listOfUpdatedShippingInfo.length)
		for (let idx = 0; idx < listOfShippingInfo.length; idx++) {
			const { address_id } = await testCreateShipping(
				server,
				token,
				shippingPath,
				listOfShippingInfo[idx]
			)
			await testUpdateShipping(
				server,
				token,
				shippingPath + '/' + address_id,
				listOfUpdatedShippingInfo[idx]
			)
		}
	})

	it(`it should add a shipping addresses for the customer then delete it`, async () => {
		for (const shippingInfo of listOfShippingInfo) {
			const { address_id } = await testCreateShipping(
				server,
				token,
				shippingPath,
				shippingInfo
			)
			await testDeleteShipping(server, token, shippingPath + '/' + address_id)
		}
	})

	it(`it should fail to retrieve the deleted shipping information`, async () => {
		for (const shippingInfo of listOfShippingInfo) {
			const { address_id } = await testCreateShipping(
				server,
				token,
				shippingPath,
				shippingInfo
			)
			await testDeleteShipping(server, token, `${shippingPath}/${address_id}`)
			await testGetNonExistentShipping(
				server,
				token,
				`${shippingPath}/${address_id}`
			)
		}
	})

	it("it should delete the user's customer account", () =>
		testDeleteCustomer(server, token, path))

	it("it should fail to get the user's customer account", () =>
		testGetNonExistentCustomer(server, token, path))
}
**/
