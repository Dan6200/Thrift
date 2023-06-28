import multer from 'multer'
import mediaStorage from '../../../controllers/helpers/media-storage.js'
import { uploadProductMedia } from '../../../controllers/private/media/index.js'
import router from '../stores/index.js'

const upload = multer({ storage: mediaStorage })
const uploadLimit = 6
router
	.route('/:productId/media')
	.post(upload.array('product-media', uploadLimit), uploadProductMedia)
// .put(updateProductMedia)
// .delete(deleteProductMedia)
export default router
