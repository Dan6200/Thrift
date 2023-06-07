import express from "express";
import {
  deleteUserAccount,
  getUserAccount,
  updateUserAccount,
  updateUserPassword,
} from "../../controllers/user-account/index.js";
import vendorAccountRouter from "./vendor-account/index.js";
import customerAccountRouter from "./customer-account/index.js";
const router = express.Router();

router
  .route("/")
  .get(getUserAccount)
  .delete(deleteUserAccount)
  .patch(updateUserAccount);

// user password route
router.route("/password").patch(updateUserPassword);

// vendor account route
router.use("/vendor", vendorAccountRouter);
// customer account route
router.use("/customer", customerAccountRouter);

export default router;
