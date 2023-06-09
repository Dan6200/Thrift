import express from "express";
import multer from "multer";
import mediaStorage from "../../../../../controllers/helpers/media-storage.js";
import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../../../../../controllers/user-account/vendor-account/shops/products/index.js";
import { uploadProductMedia } from "../../../../../controllers/user-account/vendor-account/shops/products/media.js";
const upload = multer({ storage: mediaStorage });
const router = express.Router();

router.route("/").post(createProduct).get(getAllProducts);
router
  .route("/:productId")
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

router
  .route("/:productId/media")
  .post(upload.single("product-media"), uploadProductMedia)
  .get()
  .put()
  .delete();

export default router;
