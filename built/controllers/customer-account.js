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
import path from 'path';
const fileName = path.basename(__filename);
const createCustomerAccount = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = request.user;
    yield db.query(`insert into marketplace.customer values ($1)`, [userId]);
    response.status(StatusCodes.CREATED).end();
});
const getCustomerAccount = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = request.user;
    const customerData = (yield db.query(`select * from marketplace.customer
		where customer_id=$1`, [userId])).rows[0];
    if (!customerData)
        throw new NotFoundError('Customer Account cannot be found');
    response.status(StatusCodes.OK).send({
        customerData
    });
});
const updateCustomerAccount = (request, response) => __awaiter(void 0, void 0, void 0, function* () { });
const deleteCustomerAccount = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = request.user;
    yield db.query(`delete from marketplace.customer
			where customer_id=$1`, [userId]);
    response.status(StatusCodes.OK).end();
});
export { createCustomerAccount, getCustomerAccount, updateCustomerAccount, deleteCustomerAccount };
