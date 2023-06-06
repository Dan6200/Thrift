import { Router } from "express";
import { login, register, logout } from "../controllers/auth.js";
import authentication from "../middleware/authentication.js";
const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/logout", authentication, logout);

export default router;
