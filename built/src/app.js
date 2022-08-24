var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import 'dotenv/config';
////////////// Middlewares //////////////
import 'express-async-errors';
// security
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss-clean';
import rateLimiter from 'express-rate-limit';
// logger
import morgan from 'morgan';
// routers
import authRouter from './routes/auth';
import userAccountRouter from './routes/user-account';
import customerAccountRouter from './routes/customer-account';
import vendorAccountRouter from './routes/vendor-account';
import '../index';
// error handler
import errorHandlerMiddleware from './middleware/error-handler';
// authentication
import authenticateUser from './middleware/authentication';
import path from 'path';
let fileName = path.basename(__filename);
////////////// Middlewares //////////////
let application = express();
console.log(global.appRoot);
application.set('views', global.appRoot + '/view');
application.set('view engine', 'pug');
application.set('trust proxy', 1);
application.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}));
application.use(express.json());
application.use(helmet());
application.use(cors());
application.use(xss());
application.use(morgan('tiny'));
// routes
application.use('/api/v1/auth', authRouter);
application.use('/api/v1/user-account', authenticateUser, userAccountRouter);
application.use('/api/v1/user-account/vendor', authenticateUser, vendorAccountRouter);
application.use('/api/v1/user-account/customer', authenticateUser, customerAccountRouter);
application.get('/', (_request, response) => {
    response.render('index');
});
application.get('/login', (_request, response) => {
    response.render('login');
});
application.use(errorHandlerMiddleware);
const port = process.env.PORT;
let start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (require.main === module)
            application.listen(port, () => console.log(`Server is listening on port ${port}...`));
    }
    catch (error) {
        console.log(error, fileName);
    }
});
start();
export default application;
