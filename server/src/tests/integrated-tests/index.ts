//cspell:disable
import "express-async-errors";
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../app.js";
import db from "../../db/index.js";
import {
  emailLogin,
  logout,
  phoneLogin,
  registration,
} from "../helpers/auth/index.js";
import { StatusCodes } from "http-status-codes";
import {
  testCreateCustomer,
  testGetCustomer,
  testDeleteCustomer,
  testGetNonExistentCustomer,
} from "../helpers/user/customer/index.js";
import {
  testCreateShipping,
  testGetShipping,
  testUpdateShipping,
  testDeleteShipping,
  testGetNonExistentShipping,
} from "../helpers/user/customer/shipping.js";
import {
  testGetUser,
  testUpdateUser,
  testChangeUserPassword,
  testDeleteUser,
  testDontGetUser,
} from "../helpers/user/index.js";
import {
  testCreateVendor,
  testGetVendor,
  testDeleteVendor,
  testGetNonExistentVendor,
} from "../helpers/user/vendor/index.js";
import {
  testCreateProduct,
  testGetAllProduct,
  testGetProduct,
  testDeleteProduct,
  testGetNonExistentProduct,
} from "../helpers/user/vendor/products.js";
import { load } from "js-yaml";
import { readFileSync } from "fs";
import { UserData } from "../../types-and-interfaces/user.js";
import { fileURLToPath } from "url";
import { log } from "console";

chai.use(chaiHttp).should();

const newUsersYaml = fileURLToPath(
  new URL("../data/users/new-users.yaml", import.meta.url)
);
const newUsers = load(readFileSync(newUsersYaml, "utf8")) as UserData[];

const updateUsersYaml = fileURLToPath(
  new URL("../data/users/update-user.yaml", import.meta.url)
);
const usersInfoUpdated = load(
  readFileSync(updateUsersYaml, "utf8")
) as UserData[];

const updateUsersPasswordsYaml = fileURLToPath(
  new URL("../data/users/update-user-password.yaml", import.meta.url)
);
const usersPasswordsUpdated = load(
  readFileSync(updateUsersPasswordsYaml, "utf8")
) as UserData[];

const shippingInfoYaml = fileURLToPath(
  new URL("../data/users/customers/shipping-info.yaml", import.meta.url)
);
const shippingInfoList = <any[]>load(readFileSync(shippingInfoYaml, "utf8"));

const updatedShippingInfoYaml = fileURLToPath(
  new URL("../data/users/customers/update-shipping-info.yaml", import.meta.url)
);
const updatedShippingInfoList = <any[]>(
  load(readFileSync(updatedShippingInfoYaml, "utf8"))
);

export default function (index: number): void {
  before(async () => {
    await db.query("delete from user_accounts");
  });
  // Testing the register route
  describe(`Testing typical user actions`, async () => {
    const url = "https://thrift-production.up.railway.app";
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

    const updatedUserPassword = usersPasswordsUpdated[index];

    it("it should change the user's password", () =>
      testChangeUserPassword(agent, updatedUserPassword));

    it("it should create a customer account for the user", () =>
      testCreateCustomer(agent));

    it("it should get the user's customer account", () =>
      testGetCustomer(agent));

    const shippingInfo = shippingInfoList[index];

    it(`it should add shipping addresses for the customer then retrieve it`, () =>
      testCreateShipping(agent, shippingInfo).then((result) =>
        testGetShipping(agent, null, `/${result.address_id}`)
      ));

    const updatedShippingInfo = updatedShippingInfoList[index];

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

    /*
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
	  */

    it("it should delete the user's vendor account", () =>
      testDeleteVendor(agent));

    it("it should fail to get the user's vendor account", () =>
      testGetNonExistentVendor(agent));

    it("it should delete the user's account", () => testDeleteUser(agent));

    it("it should logout user", () => logout(agent));

    it("it should fail to get user's account", () => testDontGetUser(agent));

    it("it should fail to login user", () =>
      emailLogin(agent, user, StatusCodes.UNAUTHORIZED));
  });
}
