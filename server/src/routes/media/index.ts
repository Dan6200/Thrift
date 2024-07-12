// cspell:disable
import express from 'express'
import multer from 'multer'
import { cloudinaryStorage } from '../../controllers/utils/media-storage.js'
import { uploadProductMedia } from '../../controllers/media/index.js'

const router = express.Router()
const upload = multer({ storage: cloudinaryStorage })
const uploadLimit = 12
router
  .route('/')
  .post(upload.array('product-media', uploadLimit), uploadProductMedia)
// TODO: implement these
// .put(updateProductMedia)
// .delete(deleteProductMedia)
export default router
