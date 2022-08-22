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
import { users } from '../authentication/test-data';
chai.use(chaiHttp);
const should = chai.should(), expect = chai.expect;
const testCreateVendorAccount = () => {
    describe('/POST vendor account', () => {
        it('it should create a vendor account for the user', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const userIds = yield users.getUserIDs();
                userIds.should.not.be.empty;
                console.log(`\nusers: %O`, userIds);
                for (const ID of userIds) {
                    const userToken = yield users.getUserToken(ID);
                    console.log(`\nUser ID: ${ID}, Data %o`, userToken);
                    const response = yield chai
                        .request(application)
                        .post('/api/v1/user-account/vendor')
                        .send({ ID })
                        .auth(userToken, { type: 'bearer' });
                    response.should.have.status(StatusCodes.CREATED);
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        }));
    });
};
const testGetVendorAccount = (deleted) => {
    describe('/GET vendor account', () => {
        it(`it should ${(deleted && 'fail to ') || ''}retrieve the User account`, () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const userIds = yield users.getUserIDs();
                userIds.should.not.be.empty;
                console.log(`\nusers: %O`, userIds);
                for (const ID of userIds) {
                    const userToken = yield users.getUserToken(ID);
                    console.log(`\nUser ID: ${ID}, Data %o`, userToken);
                    const response = yield chai
                        .request(application)
                        .get('/api/v1/user-account/vendor')
                        .auth(userToken, { type: 'bearer' });
                    if (deleted) {
                        response.should.have.status(StatusCodes.NOT_FOUND);
                        continue;
                    }
                    response.should.have.status(StatusCodes.OK);
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        }));
    });
};
const testUpdateVendorAccount = () => { };
const testDeleteVendorAccount = () => {
    describe('/DELETE vendor account', () => {
        it('it should delete the vendor account', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const userIds = yield users.getUserIDs();
                userIds.should.not.be.empty;
                console.log(`\nusers: %O`, userIds);
                for (const ID of userIds) {
                    const userToken = yield users.getUserToken(ID);
                    console.log(`\nUser ID: ${ID}, Data %o`, userToken);
                    const response = yield chai
                        .request(application)
                        .delete('/api/v1/user-account/vendor')
                        .auth(userToken, { type: 'bearer' });
                    response.should.have.status(StatusCodes.OK);
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        }));
    });
};
export { testGetVendorAccount, testUpdateVendorAccount, testCreateVendorAccount, testDeleteVendorAccount, };
