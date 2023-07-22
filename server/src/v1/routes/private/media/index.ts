import express from 'express'
import multer from 'multer'
import mediaStorage from '../../../controllers/helpers/media-storage.js'
import { uploadProductMedia } from '../../../controllers/private/media/index.js'

const router = express.Router()
const upload = multer({ storage: mediaStorage })
const uploadLimit = 12
router
	.route('/')
	.post(upload.array('product-media', uploadLimit), uploadProductMedia)
// .put(updateProductMedia)
// .delete(deleteProductMedia)
export default router
