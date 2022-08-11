const express = require('express')
const router = express.Router()


const {
	getUserAccount,
	deleteUserAccount,
	updateUserAccount,
	createCustomerAccount,
	getCustomerAccount,
	updateCustomerAccount,
	deleteCustomerAccount,
	createVendorAccount,
	getVendorAccount,
	updateVendorAccount,
	deleteVendorAccount
} = require('../controllers/user-account')

router
	.route('/')
		.get(getUserAccount)
		.patch(updateUserAccount)
		.delete(deleteUserAccount)

router
	.route('/customer')
		.post(createCustomerAccount)
	//	.get(getCustomerAccount)
	//	.patch(updateCustomerAccount)
	//	.delete(deleteCustomerAccount)

router
	.route('/vendor')
		.post(createVendorAccount)
	//	.get(getVendorAccount)
	//	.patch(updateVendorAccount)
	//	.delete(deleteVendorAccount)

// router
// 	.route('/:id')
// 	.get(getJob)
// 	.patch(updateJob)
// 	.delete(deleteJob)

module.exports = router
