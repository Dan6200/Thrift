import express from 'express';
const router = express.Router();

import {
	createShippingInfo,
	getAllShippingInfo,
	getShippingInfo,
	updateShippingInfo,
	deleteShippingInfo,
} from 'controllers/customer-account/shipping-info';

router.route('/').post(createShippingInfo).get(getAllShippingInfo);

router
	.route('/:addressId')
	.get(getShippingInfo)
	.patch(updateShippingInfo)
	.delete(deleteShippingInfo);

export default router;
