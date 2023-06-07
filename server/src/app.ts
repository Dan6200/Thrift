// vim mark
// cspell:ignore middlewares
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import "express-async-errors";
import helmet from "helmet";
import morgan from "morgan";
import xss from "xss-clean";
import rateLimiter from "express-rate-limit";
import cookieParser from "cookie-parser";
// routers
import authRouter from "./routes/auth.js";
import userAccountRouter from "./routes/user-account/index.js";
import customerAccountRouter from "./routes/user-account/customer-account/index.js";
import shippingInfoRouter from "./routes/user-account/customer-account/shipping-info.js";
import vendorAccountRouter from "./routes/user-account/vendor-account/index.js";
import shopRouter from "./routes/user-account/vendor-account/shops/index.js";
import productsRouter from "./routes/user-account/vendor-account/products.js";
// middlewares
import errorHandlerMiddleware from "./middleware/error-handler.js";
import authenticateUser from "./middleware/authentication.js";
import notFound from "./middleware/not-found.js";
import path from "path";
dotenv.config();

////////////// Middlewares //////////////
let app: Express = express();
app.set("trust proxy", 1);
app.use(cookieParser());
// app.use(
// rateLimiter({
// windowMs: 15 * 60 * 1000,
// max: 100,
// standardHeaders: true,
// legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// })
// );
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(morgan("dev"));
// routes
// public
app.use("/api/v1/auth", authRouter);
// user account
app.use("/api/v1/user", authenticateUser, userAccountRouter);
// vendor Account
app.use("/api/v1/user/vendor", authenticateUser, vendorAccountRouter);
app.use("/api/v1/user/vendor/shops", authenticateUser, shopRouter);
app.use("/api/v1/user/vendor/products", authenticateUser, productsRouter);
// customer account
app.use("/api/v1/user/customer", authenticateUser, customerAccountRouter);
app.use(
  "/api/v1/user/customer/shipping-info",
  authenticateUser,
  shippingInfoRouter
);
// helper middlewares
app.use(errorHandlerMiddleware);
app.use(notFound);
export default app;
