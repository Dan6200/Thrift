var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'express-async-errors';
import application from '../../app';
import chai from 'chai';
import chaiHttp from 'chai-http';
import db from '../../db';
import { newUsers, loginUsers, users } from './test-data';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
const fileName = path.basename(__filename), should = chai.should();
chai.use(chaiHttp);
const testRegistration = () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db.query('delete from marketplace.user_account');
        yield users.clear();
    }));
    // Testing the register route
    describe('/POST user: Registration', () => {
        it(`it should register ${newUsers.length} new users`, () => __awaiter(void 0, void 0, void 0, function* () {
            for (let i = 0; i < newUsers.length; i++) {
                console.log(`\nUser ${i + 1}: %o`, newUsers[i], fileName);
                const response = yield chai
                    .request(application)
                    .post('/api/v1/auth/register')
                    .send(newUsers[i]);
                response.should.have.status(StatusCodes.CREATED);
                response.body.should.be.an('object');
                const responseObject = response.body;
                console.log(`\nresponse %o`, responseObject, fileName);
                responseObject.should.have.property('userId');
                responseObject.should.have.property('token');
                const { userId, token } = responseObject;
                yield users.addUser(userId, token);
            }
            console.log(users, fileName);
        }));
    });
};
const testLogin = (count) => {
    // Testing the login route
    describe('/POST user: Login', () => {
        const n = count - 1;
        beforeEach(() => {
            // clear the saved user tokens before registration
            // user = {}
            console.log('user tokens cleared', fileName);
        });
        const noOfUsers = loginUsers[n].length;
        it(`it should login ${noOfUsers} users`, () => __awaiter(void 0, void 0, void 0, function* () {
            for (let i = 0; i < noOfUsers; i++) {
                console.log(`\nUser ${i + 1}: %o`, loginUsers[n][i], fileName);
                const response = yield chai
                    .request(application)
                    .post('/api/v1/auth/login')
                    .send(loginUsers[n][i]);
                response.should.have.status(StatusCodes.OK);
                response.body.should.be.an('object');
                const responseObject = response.body;
                console.log(`\nresponse %o`, responseObject, fileName);
                responseObject.should.have.property('userId');
                responseObject.should.have.property('token');
                const { userId, token } = responseObject;
                yield users.addUser(userId, token);
            }
        }));
    });
};
export { testRegistration, testLogin, users };
