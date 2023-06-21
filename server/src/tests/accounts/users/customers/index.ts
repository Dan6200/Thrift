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
import db from '../../../../db/index.js'
import { UserData } from '../../../../types-and-interfaces/user.js'
import ShippingInfo from '../../../../types-and-interfaces/shipping-info.js'
import assert from 'assert'

export default function (
	agent: ChaiHttp.Agent,
	{
		userInfo,
		listOfShippingInfo,
		listOfUpdatedShippingInfo,
	}: {
		userInfo: UserData
		listOfShippingInfo: ShippingInfo[]
		listOfUpdatedShippingInfo: ShippingInfo[]
	}
) {
	after(async () => db.query('delete from user_accounts'))

	const path = '/v1/user-account/customer-account'

	it('it should register a new user', () => registration(agent, userInfo))

	it('it should create a customer account for the user', () =>
		testCreateCustomer(agent, path))

	it("it should get the user's customer account", () =>
		testGetCustomer(agent, path))

	const shippingPath = path + '/shipping'

	it(`it should add shipping addresses for the customer then retrieve it`, async () => {
		for (const shippingInfo of listOfShippingInfo) {
			const { address_id } = await testCreateShipping(
				agent,
				shippingPath,
				shippingInfo
			)
			await testGetShipping(agent, shippingPath + '/' + address_id)
		}
	})

	it(`it should add a shipping addresses for the customer then update it`, async () => {
		assert(listOfShippingInfo.length === listOfUpdatedShippingInfo.length)
		for (let idx = 0; idx < listOfShippingInfo.length; idx++) {
			const { address_id } = await testCreateShipping(
				agent,
				shippingPath,
				listOfShippingInfo[idx]
			)
			await testUpdateShipping(
				agent,
				shippingPath + '/' + address_id,
				listOfUpdatedShippingInfo[idx]
			)
		}
	})

	it(`it should add a shipping addresses for the customer then delete it`, async () => {
		for (const shippingInfo of listOfShippingInfo) {
			const { address_id } = await testCreateShipping(
				agent,
				shippingPath,
				shippingInfo
			)
			await testDeleteShipping(agent, shippingPath + '/' + address_id)
		}
	})

	it(`it should fail to retrieve the deleted shipping information`, async () => {
		for (const shippingInfo of listOfShippingInfo) {
			const { address_id } = await testCreateShipping(
				agent,
				shippingPath,
				shippingInfo
			)
			await testDeleteShipping(agent, `${shippingPath}/${address_id}`)
			await testGetNonExistentShipping(agent, `${shippingPath}/${address_id}`)
		}
	})

	it("it should delete the user's customer account", () =>
		testDeleteCustomer(agent, path))

	it("it should fail to get the user's customer account", () =>
		testGetNonExistentCustomer(agent, path))
}
