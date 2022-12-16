import express from 'express';
import multer from 'multer';
import mediaStorage from '../../../controllers/helpers/media-storage';
import {
	createProduct,
	getAllProducts,
	getProduct,
	updateProduct,
	deleteProduct,
} from '../../../controllers/user-account/vendor-account/products';
const upload = multer({ storage: mediaStorage });
import { uploadProductMedia } from '../../../controllers/user-account/vendor-account/products/media';
const router = express.Router();

router.route('/').post(createProduct).get(getAllProducts);
router
	.route('/:productId')
	.get(getProduct)
	.put(updateProduct)
	.delete(deleteProduct);

router
	.route('/:productId/media')
	.post(upload.single('productMedia'), uploadProductMedia);

export default router;
