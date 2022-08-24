var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { StatusCodes } from 'http-status-codes';
import db from '../db';
const errorHandlerMiddleware = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let customError = {
        // set default
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong try again later',
    };
    if (customError.statusCode === StatusCodes.NOT_FOUND)
        res.status(customError.statusCode).send(`<h1>
			${customError.msg}
		</h1>
	`);
    console.error(err);
    console.error('last query was ', db.lastQuery);
    return res.status(customError.statusCode).json({
        msg: customError.msg,
    });
});
export default errorHandlerMiddleware;
