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
import { BadRequestError, UnauthenticatedError } from '../errors';
import path from 'path';
// import validatePhoneNumber from '../security/validate-phone';
// import validateEmail from '../security/validate-email';
import { hashPassword, validatePassword } from '../security/password';
import { createToken } from '../security/create-token';
// import locateIP from '../security/ipgeolocator';
const fileName = path.basename(__filename);
const register = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = request.body, { first_name: firstName, last_name: lastName, phone, email, password, } = userData;
    if (!phone && !email) {
        throw new BadRequestError(`please provide an email address or phone number`);
    }
    if (!password) {
        throw new BadRequestError(`please provide a password`);
    }
    let contact = '';
    if (email) {
        // TODO: const validEmail = validateEmail(email)
        const validEmail = true;
        if (!validEmail)
            throw new BadRequestError(`
				please provide a valid email address
			`);
        // TODO: Email verification
        contact += 'email,\n';
    }
    if (phone) {
        // TODO: const validPhoneNumber = validatePhoneNumber(phone)
        const validPhoneNumber = true;
        if (!validPhoneNumber)
            throw new BadRequestError(`
				please provide a valid phone number
			`);
        // TODO: SMS verification
        contact += 'phone,\n';
    }
    userData.password = yield hashPassword(password);
    userData.initials = firstName.charAt(0) + lastName.charAt(0);
    yield db.query(`
		insert into  marketplace.user_account (
			first_name,
			last_name,
			${contact} password,
			ip_address,
			country,
			dob,
			is_vendor,
			is_customer,
			initials
		) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, Object.values(userData));
    let result = yield db.query('select user_id from marketplace.user_account'), lastInsert = result.rowCount - 1, userId = result.rows[lastInsert].user_id, token = createToken(userId);
    response.status(StatusCodes.CREATED).json({
        userId,
        token,
    });
});
const login = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phone, password } = request.body;
    if (!email && !phone) {
        throw new BadRequestError('Please provide email or phone number!');
    }
    if (!password)
        throw new BadRequestError('Please provide password');
    let user;
    if (email) {
        user = (yield db.query(`
			select user_id, password
			from marketplace.user_account 
			where email=$1`, [email])).rows[0];
    }
    else {
        user = (yield db.query(`
			select user_id, password
			from marketplace.user_account 
			where phone=$1`, [phone])).rows[0];
    }
    if (!user)
        throw new UnauthenticatedError('Invalid Credentials');
    const pwdIsValid = yield validatePassword(password, user.password.toString());
    if (!pwdIsValid)
        throw new UnauthenticatedError('Invalid Credentials');
    // TODO: confirm user if there is a different IP Address
    // TODO: create separate IP Address tables as users may login
    // ...different IP Addresses
    const userId = user.user_id;
    const token = createToken(userId);
    response.status(StatusCodes.OK).json({
        userId,
        token,
    });
});
export { register, login };
