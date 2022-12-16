import express from 'express';
import {
	createShop,
	getAllShops,
	getShop,
	updateShop,
	deleteShop,
} from '../../../../controllers/user-account/vendor-account/shops';
const router = express.Router();

router.route('/').post(createShop).get(getAllShops);

router.route('/:shopId').get(getShop).put(updateShop).delete(deleteShop);

export default router;
