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

router.route('/:shopId').get(getShop).put(updateShop).delete(deleteShop);

export default router;
