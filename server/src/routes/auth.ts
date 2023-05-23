import { Router } from "express";
const router = Router();

import { login, logout, register } from "../controllers/auth";

router.post("/login", login);
router.post("/register", register);
router.get("/logout", logout);

export default router;
