var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import db from '../db';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../errors/';
import './helper-functions';
const fileName = require('path').basename(__filename);
let createProduct = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let { userId } = request.user;
    yield db.query(`insert into marketplace.product values (
			title,
			category,
			description,
			list_price,
			net_price,
			vendor_id
		)`, [userId]);
    response.status(StatusCodes.CREATED).json({
        newProductId: userId,
    });
});
let getProduct = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let result = (yield db.query(`select * from marketplace.product
		where product_id=$1`, [userId])).rows[0];
    if (!result)
        throw new NotFoundError('product  cannot be found');
    response.status(StatusCodes.OK).json({
        productId: userId,
    });
});
let updateProduct = (request, response) => __awaiter(void 0, void 0, void 0, function* () { });
let deleteProduct = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    yield db.query(`delete from marketplace.product
		where product_id=$1`, [userId]);
    response.status(StatusCodes.OK).end();
});
export { createProduct, getProduct, updateProduct, deleteProduct };
