import express from 'express';
const router = express.Router();

import {
	createShippingInfo,
	getShippingInfo,
	updateShippingInfo,
	deleteShippingInfo,
} from '../controllers/customer-account/shipping-address';

router.route('/').post(createShippingInfo);

router
	.route('/id')
	.get(getShippingInfo)
	.patch(updateShippingInfo)
	.delete(deleteShippingInfo);

export default router;
