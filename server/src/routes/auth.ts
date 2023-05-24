import { Router } from "express";
import authentication from "../middleware/authentication";
const router = Router();

import { login, logout, register } from "../controllers/auth";

router.post("/login", login);
router.post("/register", register);
router.get("/logout", authentication, logout);

export default router;
