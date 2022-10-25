import express from 'express';
const router = express.Router();

import {
	createCustomerAccount,
	getCustomerAccount,
	deleteCustomerAccount,
} from 'customer-account';

router
	.route('/')
	.post(createCustomerAccount)
	.get(getCustomerAccount)
	.delete(deleteCustomerAccount);

export default router;
