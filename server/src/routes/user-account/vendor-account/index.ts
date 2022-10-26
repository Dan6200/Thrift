import express from 'express';
const router = express.Router();

import {
	createVendorAccount,
	getVendorAccount,
	deleteVendorAccount,
} from 'controllers/vendor-account';

router
	.route('/')
	.post(createVendorAccount)
	.get(getVendorAccount)
	.delete(deleteVendorAccount);

export default router;
