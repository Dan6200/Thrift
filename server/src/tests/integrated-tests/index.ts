//cspell:disable
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../app";
import db from "../../db";
import { login, logout, registration } from "../helpers/auth";
import { testDontGetUser, testGetUser } from "../helpers/user";
import { Ebuka } from "./user-data";

chai.use(chaiHttp).should();

export default function (): void {
  let agent: ChaiHttp.Agent;
  before(() => {
    db.query("delete from user_account");
  });
  after(() => {
    db.query("delete from user_account");
  });
  // Testing the register route
  describe("User Ebuka", () => {
    // agent = chai.request.agent("https://thrift-app-v2.onrender.com");
    // agent = chai.request.agent("localhost:1024");
    agent = chai.request.agent("https://thrift-production.up.railway.app");
    it("it should register Ebuka", registration.bind(null, agent, Ebuka));
    it("it should login Ebuka", login.bind(null, agent, Ebuka));
    it("it should get Ebuka's account", testGetUser.bind(null, agent));
    it("it should logout Ebuka", logout.bind(null, agent));
    it(
      "it should fail to get Ebuka's account",
      testDontGetUser.bind(null, agent)
    );
  });
}
