import { Router } from "express";
import { login, register, logout } from "../controllers/auth.js";
import authentication from "../middleware/authentication.js";
const handleAuth = Router();

handleAuth.post("/login", login);
handleAuth.post("/register", register);
handleAuth.get("/logout", authentication, logout);

export default handleAuth;
