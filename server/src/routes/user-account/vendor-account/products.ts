import express from "express";
import multer from "multer";
import mediaStorage from "../../../controllers/helpers/media-storage.js";
import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../../../controllers/user-account/vendor-account/products/index.js";
const upload = multer({ storage: mediaStorage });
import { uploadProductMedia } from "../../../controllers/user-account/vendor-account/products/media.js";
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
  .get(() => {});
// TODO: add get put delete

export default router;
