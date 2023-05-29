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
import { newUsers, usersInfoUpdated, usersPasswordUpdated } from "./user-data";
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
import {
  testCreateShipping,
  testDeleteShipping,
  testGetAllShipping,
  testGetNonExistentShipping,
  testGetShipping,
  testUpdateShipping,
} from "../helpers/user/customer/shipping";
import {
  updatedShippingInformationList,
  shippingInformationList,
} from "../accounts/user/customer-account/shipping-data";
import {
  testCreateShop,
  testGetShop,
  testUpdateShop,
  testDeleteShop,
  testGetNonExistentShop,
} from "../helpers/user/vendor/shop";
import {
  shopInfoList,
  updatedShopInfoList,
} from "../accounts/user/vendor-account/shop/data";

chai.use(chaiHttp).should();

export default function (index: number): void {
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
    const user = newUsers[index];

    it("it should register the user", () => registration(agent, user));

    it("it should login the user with email", () =>
      emailLogin(agent, user, StatusCodes.OK));

    it("it should login the user with phone", () =>
      phoneLogin(agent, user, StatusCodes.OK));

    it("it should get the user's account", () => testGetUser(agent));

    const updatedUserInfo = usersInfoUpdated[index];

    it("it should update the user's account", () =>
      testUpdateUser(agent, updatedUserInfo));

    const updatedUserPassword = usersPasswordUpdated[index];

    it("it should change the user's password", () =>
      testChangeUserPassword(agent, updatedUserPassword));

    it("it should delete the user's account", () => testDeleteUser(agent));

    it("it should logout user", () => logout(agent));

    it("it should fail to get user's account", () => testDontGetUser(agent));

    it("it should fail to login user", () =>
      emailLogin(agent, user, StatusCodes.UNAUTHORIZED));

    it("it should register the user", () => registration(agent, user));

    it("it should create a customer account for the user", () =>
      testCreateCustomer(agent));

    it("it should get the user's customer account", () =>
      testGetCustomer(agent));

    const shippingInfo = shippingInformationList[index];

    it(`it should add shipping addresses for the customer then retrieve it`, () =>
      testCreateShipping(agent, shippingInfo).then((result) =>
        testGetShipping(agent, null, result.address_id)
      ));

    const updatedShippingInfo = updatedShippingInformationList[index];

    it(`it should add a shipping addresses for the customer then update it`, () =>
      testCreateShipping(agent, shippingInfo).then((result) =>
        testUpdateShipping(agent, updatedShippingInfo, result.address_id)
      ));

    it(`it should add a shipping addresses for the customer then delete it,
	   it should fail to retrieve the deleted shipping information`, () =>
      testCreateShipping(agent, shippingInfo).then(async (result) => {
        const { address_id: addressId } = result;
        await testDeleteShipping(agent, null, addressId);
        await testGetNonExistentShipping(agent, null, addressId);
      }));

    it("it should delete the user's customer account", () =>
      testDeleteCustomer(agent));

    it("it should fail to get the user's customer account", () =>
      testGetNonExistentCustomer(agent));

    it("it should create a vendor account for the user", () =>
      testCreateVendor(agent));

    it("it should get the user's vendor account", () => testGetVendor(agent));

    const shopInfo = shopInfoList[index];

    it(`it should add shop for the vendor then retrieve it`, () =>
      testCreateShop(agent, shopInfo).then((result) =>
        testGetShop(agent, null, result.shop_id)
      ));

    const updatedShopInfo = updatedShopInfoList[index];

    it(`it should add a shop for the vendor then update it`, () =>
      testCreateShop(agent, shopInfo).then((result) =>
        testUpdateShop(agent, updatedShopInfo, result.shop_id)
      ));

    it(`it should add a shop for the vendor then delete it,
	   it should fail to retrieve the deleted shop information`, () =>
      testCreateShop(agent, shopInfo).then(async (result) => {
        const { shop_id: shopId } = result;
        await testDeleteShop(agent, null, shopId);
        await testGetNonExistentShop(agent, null, shopId);
      }));

    it("it should delete the user's vendor account", () =>
      testDeleteVendor(agent));

    it("it should fail to get the user's vendor account", () =>
      testGetNonExistentVendor(agent));
  });
}