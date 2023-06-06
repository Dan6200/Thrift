import express from "express";
import {
  createShippingInfo,
  getAllShippingInfo,
  getShippingInfo,
  updateShippingInfo,
  deleteShippingInfo,
} from "../../../controllers/user-account/customer-account/shipping-info.js";
const router = express.Router();

router.route("/").post(createShippingInfo).get(getAllShippingInfo);

router
  .route("/:addressId")
  .get(getShippingInfo)
  .patch(updateShippingInfo)
  .delete(deleteShippingInfo);

export default router;
