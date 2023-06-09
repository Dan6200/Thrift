import express from "express";
import {
  createStore,
  deleteStore,
  getAllStores,
  getStore,
  updateStore,
} from "../../../../controllers/user-account/vendor-account/stores/index.js";
import productsRouter from "../stores/products/index.js";
const router = express.Router();

router.route("/").post(createStore).get(getAllStores);

router.route("/:storeId").get(getStore).put(updateStore).delete(deleteStore);

router.use("/:storeId/products", productsRouter);

export default router;
