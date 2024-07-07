import express from 'express'
import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from '../../controllers/products/index.js'

const router = express.Router({ mergeParams: true })

router.route('/').post(createProduct).get(getAllProducts)
router
  .route('/:productId')
  .get(getProduct)
  .patch(updateProduct)
  .delete(deleteProduct)

export default router
