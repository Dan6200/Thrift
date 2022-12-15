// vim mark
// cspell:ignore middlewares
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import morgan from 'morgan';
import xss from 'xss-clean';
dotenv.config();
// routers
import authRouter from 'auth';
import userAccountRouter from 'user-account';
import customerAccountRouter from 'user-account/customer-account';
import shippingInfoRouter from 'user-account/customer-account/shipping-info';
import vendorAccountRouter from 'user-account/vendor-account';
import shopRouter from 'user-account/vendor-account/shops';
import productsRouter from 'user-account/vendor-account/products';
// import productsRouter from 'routes/vendor-account/shops/products';
// middlewares
import errorHandlerMiddleware from 'error-handler';
import authenticateUser from 'middleware/authentication';
import notFound from 'middleware/not-found';
// import cookieParser from 'cookie-parser';
import path from 'path';

////////////// Middlewares //////////////
let application: Express = express();
application.set('views', path.resolve(__dirname, 'client/view'));
application.set('view engine', 'pug');
application.set('trust proxy', 1);
/*
application.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000,
		max: 100,
		standardHeaders: true,
		legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	})
);
*/
application.use(express.json());
application.use(express.static(path.resolve(__dirname, 'client')));
application.use(helmet());
application.use(cors());
application.use(xss());
application.use(morgan('dev'));
// routes
// public
application.use('/api/v1/auth', authRouter);
// user account
application.use('/api/v1/user', authenticateUser, userAccountRouter);
// vendor Account
application.use('/api/v1/user/vendor', authenticateUser, vendorAccountRouter);
application.use('/api/v1/user/vendor/shop', authenticateUser, shopRouter);
application.use(
	'/api/v1/user/vendor/products',
	authenticateUser,
	productsRouter
);
// customer account
application.use(
	'/api/v1/user/customer',
	authenticateUser,
	customerAccountRouter
);
application.use(
	'/api/v1/user/customer/shipping-info',
	authenticateUser,
	shippingInfoRouter
);
// helper middlewares
application.use(errorHandlerMiddleware);
application.use(notFound);
export default application;
