import express from 'express';
import {
	createVendorAccount,
	getVendorAccount,
	deleteVendorAccount,
} from '../../../controllers/user-account/vendor-account';
const router = express.Router();

router
	.route('/')
	.post(createVendorAccount)
	.get(getVendorAccount)
	.delete(deleteVendorAccount);

export default router;
