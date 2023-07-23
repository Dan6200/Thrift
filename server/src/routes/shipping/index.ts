import express from 'express'
import {
  createShippingInfo,
  getAllShippingInfo,
  getShippingInfo,
  updateShippingInfo,
  deleteShippingInfo,
} from '../../controllers/shipping-info/authenticated/index.js'
const router = express.Router()

router.route('/').post(createShippingInfo).get(getAllShippingInfo)

router
  .route('/:shippingInfoId')
  .get(getShippingInfo)
  .put(updateShippingInfo)
  .delete(deleteShippingInfo)

export default router
