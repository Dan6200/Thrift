import express from 'express'
import {
  getAllProducts,
  getProduct,
} from '../../../controllers/products/public/index.js'

const router = express.Router()

router.route('/').get(getAllProducts)
router.route('/:productId').get(getProduct)

export default router
