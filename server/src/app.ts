import express, { Express, Request, Response } from 'express';

import 'dotenv/config';

////////////// Middlewares //////////////

import 'express-async-errors';

// security
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss-clean';
import rateLimiter from 'express-rate-limit';

// 	database
import db from './db';

// logger
import morgan from 'morgan';

// TODO: research these!!!
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

// routers
import authRouter from './routes/auth';

import userAccountRouter from './routes/user-account';
import customerAccountRouter from './routes/customer-account';
import vendorAccountRouter from './routes/vendor-account';
// import productsRouter from './routes/products';

// error handler
import errorHandlerMiddleware from './middleware/error-handler';

// authentication
import authenticateUser from './middleware/authentication';

import path from 'path';

////////////// Middlewares //////////////

let application: Express = express();

application.set('views', path.resolve(__dirname, '../../client/view'));
application.set('view engine', 'pug');

application.set('trust proxy', 1);

application.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
		standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
		legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	})
);

application.use(express.json());

application.use(express.static(path.resolve(__dirname, '../../client')));

application.use(helmet());

application.use(cors());

application.use(xss());

application.use(morgan('tiny'));

// routes
application.use('/api/v1/auth', authRouter);

application.use('/api/v1/user-account', authenticateUser, userAccountRouter);

application.use(
	'/api/v1/user-account/vendor',
	authenticateUser,
	vendorAccountRouter
);

application.use(
	'/api/v1/user-account/customer',
	authenticateUser,
	customerAccountRouter
);

application.use(errorHandlerMiddleware);

export default application;
