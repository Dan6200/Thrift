const express = require('express')
const router = express.Router()


const {
	getUserAccount,
	deleteUserAccount,
	updateUserAccount,
} = require('../controllers/user-account')

router
	.route('/')
		.get(getUserAccount)
		.patch(updateUserAccount)
		.delete(deleteUserAccount)

module.exports = router
