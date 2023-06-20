//////////////////////////////////////////////
// Vendor Payment Information Router
//////////////////////////////////////////////
import express from 'express'
import {
	createPaymentInfo,
	getAllPaymentInfo,
	getPaymentInfo,
	updatePaymentInfo,
	deletePaymentInfo,
} from '../../../controllers/user-account/vendor-account/payments.js'
const router = express.Router()

router.route('/').post(createPaymentInfo).get(getAllPaymentInfo)

router
	.route('/:paymentId')
	.get(getPaymentInfo)
	.put(updatePaymentInfo)
	.delete(deletePaymentInfo)

export default router
