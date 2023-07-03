import express from 'express'
import { getAllProducts } from '../../../controllers/public/products/index.js'

const router = express.Router()

router.route('/').get(getAllProducts)

export default router
