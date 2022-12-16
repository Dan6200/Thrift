import express from 'express';
import {
	getUserAccount,
	deleteUserAccount,
	updateUserAccount,
	updateUserPassword,
} from '../../controllers/user-account';
const router = express.Router();

router
	.route('/')
	.get(getUserAccount)
	.delete(deleteUserAccount)
	.patch(updateUserAccount);
router.route('/password').patch(updateUserPassword);
export default router;
