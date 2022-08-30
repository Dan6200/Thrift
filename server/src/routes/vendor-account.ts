import express from 'express';
const router = express.Router()


import {
    createVendorAccount,
    getVendorAccount,
    updateVendorAccount,
    deleteVendorAccount,
} from '../controllers/vendor-account';

router
	.route('/')
		.post(createVendorAccount)
		.get(getVendorAccount)
		.patch(updateVendorAccount)
		.delete(deleteVendorAccount)

export default router;
