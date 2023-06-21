import express from 'express'
import {
	createVendorAccount,
	getVendorAccount,
	deleteVendorAccount,
} from '../../../controllers/user-account/vendor-account/index.js'
import storeRouter from './stores/index.js'
// import paymentsRouter from './payments.js'
const router = express.Router()

router
	.route('/')
	.post(createVendorAccount)
	.get(getVendorAccount)
	.delete(deleteVendorAccount)

router.use('/stores', storeRouter)
// router.use('/payment-info', paymentsRouter)
export default router
