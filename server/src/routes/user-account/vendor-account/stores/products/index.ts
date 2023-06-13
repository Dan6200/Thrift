import express from "express";
import multer from "multer";
import mediaStorage from "../../../../../controllers/helpers/media-storage.js";
import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  updateProductBulkEdit,
} from "../../../../../controllers/user-account/vendor-account/stores/products/index.js";
import { uploadProductMedia } from "../../../../../controllers/user-account/vendor-account/stores/products/media.js";
const upload = multer({ storage: mediaStorage });
const router = express.Router({ mergeParams: true });

router.route("/").post(createProduct).get(getAllProducts);
router
  .route("/:productId")
  .get(getProduct)
  .patch(updateProduct)
  // allow put for bulk edits for updating product
  .put(updateProductBulkEdit)
  .delete(deleteProduct);

const uploadLimit = 6;
router
  .route("/:productId/media")
  // .post(upload.single("product-media"), uploadProductMedia)
  .post(upload.array("product-media", uploadLimit), uploadProductMedia);
// .get(getProductMedia)
// .put(updateProductMedia)
// .delete(deleteProductMedia);

export default router;
