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
/* get route /.../vendor/shop/products clashes with
 * get route /.../vendor/shop/:shopId, express takes "products" as a route parameter,
 * ... need a separate all route
 */
router.route('/').post(createProduct);
router.route('/all').get(getAllProducts);
router
	.route('/:productId')
	.get(getProduct)
	.put(updateProduct)
	.delete(deleteProduct);

export default router;
