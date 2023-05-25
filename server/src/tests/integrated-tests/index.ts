//cspell:disable
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../app";
import db from "../../db";
import { emailLogin, logout, phoneLogin, registration } from "../helpers/auth";
import { testDontGetUser, testGetUser, testUpdateUser } from "../helpers/user";
import { newUsers } from "./user-data";

chai.use(chaiHttp).should();

export default function (count: number): void {
  before(() => {
    // TODO: debug these
    db.query("delete from user_account");
  });
  after(() => {
    // TODO: debug these
    db.query("delete from user_account");
  });
  // Testing the register route
  describe(`Testing typical user actions`, () => {
    // agent = chai.request.agent();
    // const url = "https://thrift-app-v2.onrender.com";
    const url = "https://thrift-production.up.railway.app";
    // const url = "localhost:1024";
    const agent = chai.request.agent(url);
    const user = newUsers[count];
    it("it should register the user", registration.bind(null, agent, user));
    it(
      "it should login the user with email",
      emailLogin.bind(null, agent, user)
    );
    it(
      "it should login the user with phone",
      phoneLogin.bind(null, agent, user)
    );
    it(
      "it should get the user's account",
      testGetUser.bind(null, agent, count)
    );
    it(
      "it should update the user's account",
      testUpdateUser.bind(null, agent, count)
    );
    it("it should logout user", logout.bind(null, agent));
    it(
      "it should fail to get user's account",
      testDontGetUser.bind(null, agent, count)
    );
  });
}
