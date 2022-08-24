var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import { UnauthenticatedError } from '../errors';
import path from 'path';
let fileName = path.basename(__filename);
export default (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    // check header
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
        throw new UnauthenticatedError('Authentication invalid');
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // attach the user id to the Job route
        console.log('payload %o: ', payload, fileName);
        request.user = payload;
        next();
    }
    catch (err) {
        throw new UnauthenticatedError('Authentication invalid');
    }
});
