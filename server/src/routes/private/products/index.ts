import express from 'express'
import {
	createProduct,
	getAllProducts,
	getProduct,
	updateProduct,
	deleteProduct,
} from '../../../controllers/private/products/index.js'
// const upload = multer({ storage: mediaStorage })
const router = express.Router({ mergeParams: true })

router.route('/').post(createProduct).get(getAllProducts)
router
	.route('/:productId')
	.get(getProduct)
	.patch(updateProduct)
	.delete(deleteProduct)

// const uploadLimit = 6
// router
// 	.route('/:productId/media')
// 	.post(upload.array('product-media', uploadLimit), uploadProductMedia)
// .put(updateProductMedia)
// .delete(deleteProductMedia);

export default router
