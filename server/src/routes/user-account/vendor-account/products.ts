import express from 'express';
const router = express.Router();

import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getProduct,
	updateProduct,
} from 'controllers/vendor-account/products';

router.route('/').post(createProduct).get(getAllProducts);
router
	.route('/:productId')
	.get(getProduct)
	.put(updateProduct)
	.delete(deleteProduct);
//TODO: Set up upload image functionality (image first, till MVP)
router.route('/media').post(uploadProductMedia);

export default router;
