import express from 'express';
const router = express.Router();

import {
	createShop,
	getAllShops,
	getShop,
	updateShop,
	deleteShop,
} from 'controllers/vendor-account/shops';

router.route('/').post(createShop).get(getAllShops);

router.route('/:addressId').get(getShop).patch(updateShop).delete(deleteShop);

export default router;
