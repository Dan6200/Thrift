import "express-async-errors";
import chai from "chai";
import chaiHttp from "chai-http";
import db from "../../../../db";

// import {
//   testCreateCustomer,
//   testGetCustomer,
//   testDeleteCustomer,
//   testGetNonExistentCustomer,
// } from "../../../helpers/user/customer";
// chai.use(chaiHttp).should();

export default function testCustomerAccount() {
  /*
  after(() => {
    // deletes all entries from user_account
    db.query("delete from user_account").catch((err) => console.error(err));
    db.query("delete from customer").catch((err) => console.error(err));
  });
  beforeEach(() => {
    // deletes all entries from user_account
    db.query("delete from user_account").catch((err) => console.error(err));
    db.query("delete from customer").catch((err) => console.error(err));
  });

  describe("/POST customer account", () => {
    // create new customer account
    it(`it should create new user account then a new customer account`, () =>
      registration().then((tokens) => testCreateCustomer(tokens)));
  });

  describe("/GET customer account", () => {
    it(`it should create a new user account, create a customer account and retrieve the customer account`, () =>
      registration()
        .then((tokens) => testCreateCustomer(tokens))
        .then(({ authTokens }) => testGetCustomer(authTokens)));
  });

  describe("/DELETE customer account", () => {
    it("it should create and delete the customer account", () =>
      registration()
        .then((tokens) => testCreateCustomer(tokens))
        .then(({ authTokens }) => testDeleteCustomer(authTokens)));
  });

  describe("/GET nonexistent customer account", () => {
    it(`it should fail to retrieve the customer account`, () =>
      registration().then((tokens) => testGetNonExistentCustomer(tokens)));
  });
  */
}
