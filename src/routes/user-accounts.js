const express = require('express')
const router = express.Router()

const {

	getAllAccounts,
	createVendorAccount,
	createCustomerAccount,

} = require('../controllers/user-accounts')

router
	.route('/')
	.get(getAllAccounts)

router
	.route('/customer')
	.post(createCustomerAccount)

router
	.route('/vendor')
	.post(createVendorAccount)

// router
// 	.route('/:id')
// 	.get(getJob)
// 	.patch(updateJob)
// 	.delete(deleteJob)

module.exports = router

