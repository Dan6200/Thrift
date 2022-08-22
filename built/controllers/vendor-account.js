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
const fileName = require('path').basename(__filename);
const createVendorAccount = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = request.user;
    yield db.query(`insert into marketplace.vendor values ($1)`, [userId]);
    response.status(StatusCodes.CREATED).send();
});
const getVendorAccount = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = request.user;
    const res = (yield db.query(`select vendor_id from marketplace.vendor
		where vendor_id=$1`, [userId])).rows[0];
    if (!res)
        throw new NotFoundError('Vendor account cannot be found');
    response.status(StatusCodes.OK).send();
});
const updateVendorAccount = (request, response) => __awaiter(void 0, void 0, void 0, function* () { });
const deleteVendorAccount = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = request.user;
    yield db.query(`delete from marketplace.vendor
		where vendor_id=$1`, [userId]);
    response.status(StatusCodes.OK).end();
});
export { createVendorAccount, getVendorAccount, updateVendorAccount, deleteVendorAccount, };
