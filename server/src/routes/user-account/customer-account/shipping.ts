import express from 'express'
import {
	createShippingInfo,
	getAllShippingInfo,
	getShippingInfo,
	updateShippingInfo,
	deleteShippingInfo,
} from '../../../controllers/user-account/customer-account/shipping.js'
const router = express.Router()

router.route('/').post(createShippingInfo).get(getAllShippingInfo)

router
	.route('/:addressId')
	.get(getShippingInfo)
	// put not patch. client fetches data and then replaces with new version
	.put(updateShippingInfo)
	.delete(deleteShippingInfo)

export default router
