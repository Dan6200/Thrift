import { Router } from "express";
import { login, register, logout } from "../controllers/auth.js";
import authentication from "../middleware/authentication.js";
const router = Router();
const handleAuth = Router();

router.use("/auth", handleAuth);
handleAuth.post("/login", login);
handleAuth.post("/register", register);
handleAuth.get("/logout", authentication, logout);

export default router;
