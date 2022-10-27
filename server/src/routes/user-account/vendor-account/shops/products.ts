import express from 'express';
const router = express.Router();

import {
	createProduct,
	getAllProducts,
	getProduct,
} from 'controllers/products';

router.route('/').post(createProduct).get(getAllProducts);
router.route('/productId').get(getProduct);

export default router;
