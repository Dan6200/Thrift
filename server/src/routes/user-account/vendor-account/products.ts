import express from 'express';
import {
	createProduct,
	getAllProducts,
	getProduct,
	updateProduct,
	deleteProduct,
} from '../../../controllers/user-account/vendor-account/products';
import { uploadProductMedia } from '../../../controllers/user-account/vendor-account/products/media';
const router = express.Router();

router.route('/').post(createProduct).get(getAllProducts);
router
	.route('/:productId')
	.get(getProduct)
	.put(updateProduct)
	.delete(deleteProduct);

router.route('/media').post(uploadProductMedia);

export default router;
