import 'dotenv/config';
import 'express-async-errors';
import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss-clean';
import rateLimiter from 'express-rate-limit';
import morgan from 'morgan';
// routers
import authRouter from 'auth';
import userAccountRouter from 'user-account';
import shippingInfoRouter from 'customer-account/shipping-info';
import shopRouter from 'vendor-account/shops';
// import productsRouter from 'routes/products';
// middlewares
import errorHandlerMiddleware from 'error-handler';
import authenticateUser from 'middleware/authentication';
import notFound from 'middleware/not-found';
// import cookieParser from 'cookie-parser';
// import fileUpload from 'express-fileupload';
import path from 'path';

////////////// Middlewares //////////////
let application: Express = express();
application.set('views', path.resolve(__dirname, 'client/view'));
application.set('view engine', 'pug');
application.set('trust proxy', 1);
application.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000,
		max: 100,
		standardHeaders: true,
		legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	})
);
application.use(express.json());
application.use(express.static(path.resolve(__dirname, 'client')));
application.use(helmet());
application.use(cors());
application.use(xss());
application.use(morgan('dev'));
// routes
application.use('/api/v1/auth', authRouter);
application.use('/api/v1/user', authenticateUser, userAccountRouter);
application.use('/api/v1/user/vendor/shops', authenticateUser, shopRouter);
application.use(
	'/api/v1/user/customer/shipping-info',
	authenticateUser,
	shippingInfoRouter
);
application.use(errorHandlerMiddleware);
application.use(notFound);
export default application;
