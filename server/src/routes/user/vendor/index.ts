import express from 'express'
import {
  postVendor,
  deleteVendor,
} from '../../../controllers/user/vendor/index.js'
const router = express.Router()

router.route('/').post(postVendor).delete(deleteVendor)

export default router
