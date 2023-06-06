import express from "express";
import {
  deleteUserAccount,
  getUserAccount,
  updateUserAccount,
  updateUserPassword,
} from "../../controllers/user-account/index.js";
const router = express.Router();

router
  .route("/")
  .get(getUserAccount)
  .delete(deleteUserAccount)
  .patch(updateUserAccount);
router.route("/password").patch(updateUserPassword);
export default router;
