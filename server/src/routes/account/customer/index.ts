import express from 'express'
import {
  createCustomerAccount,
  deleteCustomerAccount,
} from '../../../controllers/account/customer/index.js'
const router = express.Router()

router.route('/').post(createCustomerAccount).delete(deleteCustomerAccount)
export default router
