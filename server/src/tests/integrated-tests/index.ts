//cspell:disable
import "express-async-errors";
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../app.js";
import db from "../../db/index.js";
import { registration } from "../helpers/auth/index.js";
import { newUsers } from "./user-data.js";

chai.use(chaiHttp).should();

export default function (index: number): void {
  before(async () => {
    await db.query("delete from user_account");
  });
  // Testing the register route
  describe(`Testing typical user actions`, async () => {
    const url = "https://thrift-production.up.railway.app";
    // const agent = chai.request.agent(url);
    const agent = chai.request.agent(app);
    const user = newUsers[index];

    it("it should register the user", () => registration(agent, user));

    /*
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

    it("it should create a customer account for the user", () =>
      testCreateCustomer(agent));

    it("it should get the user's customer account", () =>
      testGetCustomer(agent));

    const shippingInfo = shippingInformationList[index];

    it(`it should add shipping addresses for the customer then retrieve it`, () =>
      testCreateShipping(agent, shippingInfo).then((result) =>
        testGetShipping(agent, null, `/${result.address_id}`)
      ));

    const updatedShippingInfo = updatedShippingInformationList[index];

    it(`it should add a shipping addresses for the customer then update it`, () =>
      testCreateShipping(agent, shippingInfo).then((result) =>
        testUpdateShipping(agent, updatedShippingInfo, `/${result.address_id}`)
      ));

    it(`it should add a shipping addresses for the customer then delete it`, async () => {
      const { address_id } = await testCreateShipping(agent, shippingInfo);
      testDeleteShipping(agent, null, `/${address_id}`);
    });

    it(`it should fail to retrieve the deleted shipping information`, async () => {
      const { address_id } = await testCreateShipping(agent, shippingInfo);
      testDeleteShipping(agent, null, `/${address_id}`);
      testGetNonExistentShipping(agent, null, `/${address_id}`);
    });

    it("it should delete the user's customer account", () =>
      testDeleteCustomer(agent));

    it("it should fail to get the user's customer account", () =>
      testGetNonExistentCustomer(agent));

    it("it should create a vendor account for the user", () =>
      testCreateVendor(agent));

    it("it should get the user's vendor account", () => testGetVendor(agent));

    it("it should create a product for sale", () =>
      testCreateProduct(agent, productData[index]));

    it("it should retrieve all products a vendor has for sale", () =>
      testGetAllProduct(agent));

    it("it should retrieve a specific product a vendor has for sale", () =>
      testCreateProduct(agent, productData[index]).then(({ product_id }) =>
        testGetProduct(agent, null, `/${product_id}`)
      ));

    it("it should delete a product a vendor has for sale", () =>
      testCreateProduct(agent, productData[index]).then(({ product_id }) =>
        testDeleteProduct(agent, null, `/${product_id}`)
      ));

    it("it should fail to retrieve a deleted product", async () => {
      const { product_id } = await testCreateProduct(agent, productData[index]);
      testDeleteProduct(agent, null, `/${product_id}`);
      testGetNonExistentProduct(agent, null, `/${product_id}`);
    });

    it("it should delete the user's vendor account", () =>
      testDeleteVendor(agent));

    it("it should fail to get the user's vendor account", () =>
      testGetNonExistentVendor(agent));

    it("it should delete the user's account", () => testDeleteUser(agent));

    it("it should logout user", () => logout(agent));

    it("it should fail to get user's account", () => testDontGetUser(agent));

    it("it should fail to login user", () =>
      emailLogin(agent, user, StatusCodes.UNAUTHORIZED));
	  */
  });
}
