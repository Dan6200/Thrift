import express from 'express';
const router = express.Router();

import {
	createCustomerAccount,
	getCustomerAccount,
	updateCustomerAccount,
	deleteCustomerAccount,
} from '../controllers/customer-account/shipping-info';

router
	.route('/')
	.post(createCustomerAccount)
	.get(getCustomerAccount)
	.patch(updateCustomerAccount)
	.delete(deleteCustomerAccount);

export default router;
