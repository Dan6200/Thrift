import express from "express";
import {
  createVendorAccount,
  getVendorAccount,
  deleteVendorAccount,
} from "../../../controllers/user-account/vendor-account/index.js";
import storeRouter from "./stores/index.js";
import productsRouter from "./products.js";
const router = express.Router();

router
  .route("/")
  .post(createVendorAccount)
  .get(getVendorAccount)
  .delete(deleteVendorAccount);

router.use("/stores", storeRouter);
router.use("/products", productsRouter);
export default router;
