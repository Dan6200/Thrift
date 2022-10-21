import express from 'express';
const router = express.Router();

import { getCustomerAccount } from 'customer-account';

router.route('/').get(getCustomerAccount);

export default router;
