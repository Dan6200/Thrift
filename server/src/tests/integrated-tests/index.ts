//cspell:disable
import "express-async-errors";
import chai from "chai";
import app from "../../app.js";
import db from "../../db/index.js";
import testAuthentication from "../authentication/index.js";
import testUserAccount from "../accounts/users/index.js";
import testCustomerAccount from "../accounts/users/customers/index.js";
import testVendorAccount from "../accounts/users/vendors/index.js";
import testProducts from "../accounts/users/vendors/products/index.js";

export default function (index: number): void {
  // Testing the register route
  describe(`Testing typical user actions`, async () => {
    const url = "https://thrift-production.up.railway.app";
    // const agent = chai.request.agent(url);
    const agent = chai.request.agent(app);

    describe("Testing Authentication", () => testAuthentication(agent, index));

    describe("Testing User Account", () => testUserAccount(agent, index));

    describe("Testing Customer Account", () =>
      testCustomerAccount(agent, index));

    describe("Testing Vendor Account", () => testVendorAccount(agent, index));

    describe("Testing Products", async () => testProducts(agent, index));
  });
}
