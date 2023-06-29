import db from '../../../db/pg/index.js'
import ShippingInfo from '../../../types-and-interfaces/shipping-info.js'
import { UserData } from '../../../types-and-interfaces/user.js'
import { registration } from '../helper-functions/auth/index.js'
import {
	testCreateCustomer,
	testDeleteCustomer,
} from '../helper-functions/user/customer/index.js'
import {
	testCreateShipping,
	testGetShipping,
	testUpdateShipping,
	testDeleteShipping,
	testGetNonExistentShipping,
} from '../helper-functions/shipping/index.js'

// Set server url
const server = process.env.DEV_APP_SERVER!
let token: string
const path = '/v1/account/customer'

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
		;({
			body: { token },
		} = await registration(server, userInfo))
		await testCreateCustomer(server, token, path)
	})

	after(async function () {
		await db.query({ text: 'delete from user_accounts' })
		await testDeleteCustomer(server, token, path)
	})

	const shippingPath = path + '/shipping'

	const shippingIds: string[] = []

	it(`it should add multiple shipping addresses for the customer`, async () => {
		for (const shippingInfo of listOfShippingInfo) {
			const { shipping_info_id } = await testCreateShipping(
				server,
				token,
				shippingPath,
				shippingInfo
			)
			shippingIds.push(shipping_info_id)
		}
	})

	it('it should retrieve all shipping information through a loop', async () => {
		for (const shippingId of shippingIds) {
			await testGetShipping(server, token, shippingPath + '/' + shippingId)
		}
	})

	it(`it should update all shipping addresses for the customer`, async () => {
		for (const [idx, shippingId] of shippingIds.entries()) {
			await testUpdateShipping(
				server,
				token,
				shippingPath + '/' + shippingId,
				listOfUpdatedShippingInfo[idx]
			)
		}
	})

	it(`it should delete all shipping addresses for the customer`, async () => {
		for (const shippingId of shippingIds) {
			await testDeleteShipping(server, token, shippingPath + '/' + shippingId)
		}
	})

	it(`it should fail to retrieve any of the deleted shipping information`, async () => {
		for (const shippingId of shippingIds) {
			await testGetNonExistentShipping(
				server,
				token,
				`${shippingPath}/${shippingId}`
			)
		}
	})
}
