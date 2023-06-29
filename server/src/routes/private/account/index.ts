import express from 'express'
import vendorAccountRouter from './vendor/index.js'
import customerAccountRouter from './customer/index.js'
import {
	getUserAccount,
	deleteUserAccount,
	updateUserAccount,
	updateUserPassword,
} from '../../../controllers/private/account/index.js'
const router = express.Router()

router
	.route('/')
	.get(getUserAccount)
	.delete(deleteUserAccount)
	.patch(updateUserAccount)

// user password route
router.route('/password').put(updateUserPassword)

// users vendor account route
router.use('/vendor', vendorAccountRouter)
// users customer account route
router.use('/customer', customerAccountRouter)

export default router
