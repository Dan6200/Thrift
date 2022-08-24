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
import { StatusCodes } from 'http-status-codes';
import { updatedUser, users } from '../authentication/test-data';
import path from 'path';
let fileName = path.basename(__filename);
chai.use(chaiHttp);
const should = chai.should(), expect = chai.expect;
const testGetUserAccount = (deleted) => {
    describe('/GET user account', () => {
        // Prints it should retrieve the User account if the user exists
        // Prints it should fail to retrieve the User account if the user doesn't exist
        it(`it should ${(deleted && 'fail to ') || ''}retrieve the User account`, () => __awaiter(void 0, void 0, void 0, function* () {
            const userIds = yield users.getUserIDs();
            deleted || userIds.should.not.be.empty;
            console.log(`\nusers: %O`, userIds, fileName);
            for (const ID of userIds) {
                const userToken = yield users.getUserToken(ID);
                console.log(`\nUser ID: ${ID}, Data: %o`, userToken);
                const response = yield chai
                    .request(application)
                    .get('/api/v1/user-account')
                    .auth(userToken, { type: 'bearer' });
                if (deleted) {
                    response.should.have.status(StatusCodes.NOT_FOUND);
                    continue;
                }
                response.should.have.status(StatusCodes.OK);
                response.body.should.be.an('object');
                const responseData = response.body;
                console.log(`\nresponse %o`, responseData);
                responseData.should.have.property('userAccount');
                const userAccount = responseData.userAccount;
                userAccount.should.have.property('first_name');
                userAccount.should.have.property('last_name');
                userAccount.should.satisfy((account) => 'email' in account || 'phone' in account);
                userAccount.should.have.property('password');
                userAccount.should.have.property('ip_address');
                userAccount.should.have.property('country');
                userAccount.should.have.property('dob');
                userAccount.should.have.property('is_vendor');
                userAccount.should.have.property('is_customer');
            }
        }));
    });
};
const testUpdateUserAccount = () => {
    describe('/PATCH user account', () => {
        it("it should update the user's account", () => __awaiter(void 0, void 0, void 0, function* () {
            let n = 0;
            const userIds = yield users.getUserIDs();
            userIds.should.not.be.empty;
            console.log(`\nusers: %O`, userIds);
            for (const ID of userIds) {
                console.log(`\nUser ID: ${ID}, Data: %o`, updatedUser[n]);
                const userToken = yield users.getUserToken(ID);
                const response = yield chai
                    .request(application)
                    .patch('/api/v1/user-account')
                    .send(updatedUser[n])
                    .auth(userToken, { type: 'bearer' });
                response.should.have.status(StatusCodes.OK);
                n++;
            }
        }));
    });
};
const testDeleteUserAccount = () => {
    describe('/DELETE user account', () => {
        it("it should delete the user's account", () => __awaiter(void 0, void 0, void 0, function* () {
            const userIds = yield users.getUserIDs();
            userIds.should.not.be.empty;
            console.log(`\nusers: %O`, userIds);
            for (const ID of userIds) {
                const userToken = yield users.getUserToken(ID);
                console.log(`\nUser ID: ${ID}, Data: %o`, userToken);
                const response = yield chai
                    .request(application)
                    .delete('/api/v1/user-account')
                    .auth(userToken, { type: 'bearer' });
                response.should.have.status(StatusCodes.OK);
            }
        }));
    });
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield users.clear();
    }));
};
export { testGetUserAccount, testUpdateUserAccount, testDeleteUserAccount };
