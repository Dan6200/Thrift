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
import { BadRequestError, NotFoundError, UnauthenticatedError, } from '../errors/';
import { genSqlUpdateCommands } from './helper-functions';
import { hashPassword, validatePassword } from '../security/password';
const fileName = require('path').basename(__filename);
let getUserAccount = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let { userId } = request.user;
    console.log('userId is %o', userId);
    let userAccount = (yield db.query(`select 
				first_name,
				last_name,
				email,
				phone,
				password,
				ip_address,
				country,
				dob,
				is_vendor,
				is_customer
			from marketplace.user_account 
			where user_id = $1`, [parseInt(userId)])).rows[0];
    if (!userAccount)
        throw new NotFoundError('User cannot be found');
    response.status(StatusCodes.OK).json({
        userAccount,
    });
});
let updateUserAccount = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let { userId } = request.user;
    if (!Object.keys(request.body).length)
        throw new BadRequestError('request data cannot be empty');
    // TODO: validate and verify updated email and phone numbers
    let { old_password: oldPassword, new_password: newPassword, } = request.body;
    if (oldPassword) {
        let { password } = (yield db.query(`select password from marketplace.user_account
			where user_id = $1`, [userId])).rows[0];
        let pwdIsValid = yield validatePassword(oldPassword, password.toString());
        if (!pwdIsValid)
            throw new UnauthenticatedError(`Invalid Credentials,
				cannot update password`);
        request.body.password = yield hashPassword(newPassword);
        delete request.body.old_password;
        delete request.body.new_password;
    }
    let fields = Object.keys(request.body), data = Object.values(request.body), offset = 2;
    yield db.query(`update marketplace.user_account
		${genSqlUpdateCommands(fields, offset)}
		where user_id = $1`, [userId, ...data]);
    response.status(StatusCodes.OK).end();
});
let deleteUserAccount = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let { userId } = request.user;
    yield db.query(`delete from marketplace.user_account
		where user_id = $1`, [userId]);
    response.status(StatusCodes.OK).end();
});
export { getUserAccount, updateUserAccount, deleteUserAccount };
