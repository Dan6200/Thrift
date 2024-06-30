import express from 'express'
// import vendorRouter from './vendor/index.js'
// import customerRouter from './customer/index.js'
import {
  postUser,
  getUser,
  deleteUser,
  patchUser,
} from '../../controllers/user/index.js'
const router = express.Router()

router
  .route('/')
  .post(postUser)
  .get(getUser)
  .delete(deleteUser)
  .patch(patchUser)

// users vendor account route
// router.use('/vendor', vendorRouter)
// users customer account route
// router.use('/customer', customerRouter)

export default router
