//cspell:disable
import "express-async-errors";
import chai from "chai";
import chaiHttp from "chai-http";
import db from "../../db";
import { emailLogin, logout, phoneLogin, registration } from "../helpers/auth";
import {
  testChangeUserPassword,
  testDeleteUser,
  testDontGetUser,
  testGetUser,
  testUpdateUser,
} from "../helpers/user";
import { newUsers } from "./user-data";
import { StatusCodes } from "http-status-codes";
import app from "../../app";
import {
  testCreateCustomer,
  testDeleteCustomer,
  testGetCustomer,
  testGetNonExistentCustomer,
} from "../helpers/user/customer";
import {
  testCreateVendor,
  testGetVendor,
  testDeleteVendor,
  testGetNonExistentVendor,
} from "../helpers/user/vendor";
import { testCreateShipping } from "../helpers/user/customer/shipping";

chai.use(chaiHttp).should();

export default function (count: number): void {
  before(async () => {
    await db.query("delete from user_account");
  });
  after(async () => {
    await db.query("delete from user_account");
  });
  // Testing the register route
  describe(`Testing typical user actions`, async () => {
    // const url = "https://thrift-production.up.railway.app";
    // const agent = chai.request.agent(url);
    const agent = chai.request.agent(app);
    const user = newUsers[count];
    let addressId: string;
    it("it should register the user", registration.bind(null, agent, user));
    it(
      "it should login the user with email",
      emailLogin.bind(null, agent, user, StatusCodes.OK)
    );
    it(
      "it should login the user with phone",
      phoneLogin.bind(null, agent, user, StatusCodes.OK)
    );
    it(
      "it should get the user's account",
      testGetUser.bind(null, agent, count)
    );
    it(
      "it should update the user's account",
      testUpdateUser.bind(null, agent, count)
    );
    it(
      "it should change the user's password",
      testChangeUserPassword.bind(null, agent, count)
    );
    it(
      "it should delete the user's account",
      testDeleteUser.bind(null, agent, null)
    );
    it("it should logout user", logout.bind(null, agent));
    it(
      "it should fail to get user's account",
      testDontGetUser.bind(null, agent, count)
    );
    it(
      "it should fail to login user",
      emailLogin.bind(null, agent, user, StatusCodes.UNAUTHORIZED)
    );
    it("it should register the user", registration.bind(null, agent, user));
    it(
      "it should create a customer account for the user",
      testCreateCustomer.bind(null, agent, count)
    );
    it(
      "it should get the user's customer account",
      testGetCustomer.bind(null, agent, count)
    );
    it("it should add the shipping information for the customer", () =>
      testCreateShipping(agent, count).then((result) => {
        addressId = result.address_id;
        console.log(addressId);
      }));
    it(
      "it should delete the user's customer account",
      testDeleteCustomer.bind(null, agent, count)
    );
    it(
      "it should fail to get the user's customer account",
      testGetNonExistentCustomer.bind(null, agent, count)
    );
    it(
      "it should create a vendor account for the user",
      testCreateVendor.bind(null, agent, count)
    );
    it(
      "it should get the user's vendor account",
      testGetVendor.bind(null, agent, count)
    );
    it(
      "it should delete the user's vendor account",
      testDeleteVendor.bind(null, agent, count)
    );
    it(
      "it should fail to get the user's vendor account",
      testGetNonExistentVendor.bind(null, agent, count)
    );
  });
}
