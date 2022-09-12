import express from 'express';
const router = express.Router()


import { getUserAccount, deleteUserAccount, updateUserAccount } from 'controllers/user-account';

router
	.route('/')
		.get(getUserAccount)
		.patch(updateUserAccount)
		.delete(deleteUserAccount)

export default router;
