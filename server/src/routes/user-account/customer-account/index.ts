import express from 'express';
import {
	createCustomerAccount,
	deleteCustomerAccount,
	getCustomerAccount,
} from '../../../controllers/user-account/customer-account';
const router = express.Router();

router
	.route('/')
	.post(createCustomerAccount)
	.get(getCustomerAccount)
	.delete(deleteCustomerAccount);

export default router;
