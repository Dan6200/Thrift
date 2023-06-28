import express from 'express'
import {
	createCustomerAccount,
	getCustomerAccount,
	deleteCustomerAccount,
} from '../../../../controllers/private/account/customer/index.js'
const router = express.Router()

router.route('/').post(createCustomerAccount).delete(deleteCustomerAccount)
export default router
