import express from "express";
import {
  createVendorAccount,
  getVendorAccount,
  deleteVendorAccount,
} from "../../../controllers/user-account/vendor-account/index.js";
import shopRouter from "./shops/index.js";
import productsRouter from "./products.js";
const router = express.Router();

router
  .route("/")
  .post(createVendorAccount)
  .get(getVendorAccount)
  .delete(deleteVendorAccount);

router.use("/shops", shopRouter);
router.use("/products", productsRouter);
export default router;
