import express from 'express'
import vendorRouter from './vendor/index.js'
import customerRouter from './customer/index.js'
import {
  postUser,
  getUser,
  deleteUser,
  updateUser,
  updateUserPassword,
} from '../../controllers/user/index.js'
const router = express.Router()

router
  .route('/')
  .post(createUser)
  .get(getUser)
  .delete(deleteUser)
  .patch(updateUser)

// user password route
router.route('/password').put(updateUserPassword)

// users vendor account route
router.use('/vendor', vendorRouter)
// users customer account route
router.use('/customer', customerRouter)

export default router
