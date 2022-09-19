import express from 'express';
const router = express.Router();

import {
	getUserAccount,
	deleteUserAccount,
	updateUserAccount,
	updateUserPassword,
} from 'controllers/user-account';

router.route('/').get(getUserAccount).delete(deleteUserAccount);
router.route('/info').patch(updateUserAccount);
router.route('/password').patch(updateUserPassword);
export default router;
