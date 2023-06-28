import express from 'express'
import {
	createCustomerAccount,
	deleteCustomerAccount,
	getCustomerAccount,
} from '../../../controllers/user-account/customer-account/index.js'
import shippingInfoRouter from './shipping.js'
const router = express.Router()

router
	.route('/')
	.post(createCustomerAccount)
	.get(getCustomerAccount)
	.delete(deleteCustomerAccount)
router.use('/shipping', shippingInfoRouter)
export default router
