import express from 'express';
const router = express.Router();

import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getProduct,
	updateProduct,
} from 'controllers/products';

router.route('/').post(createProduct).get(getAllProducts);
router
	.route('/:productId')
	.get(getProduct)
	.put(updateProduct)
	.delete(deleteProduct);

export default router;
