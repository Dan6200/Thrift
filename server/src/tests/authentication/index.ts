//cspell:disable
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../app";
import db from "../../db";
import { login, logout, registration } from "../helpers/auth";
import { Ebuka } from "./user-data";

chai.use(chaiHttp).should();

export default function (): void {
  let agent: ChaiHttp.Agent;
  before(() => {
    agent = chai.request.agent(app);
    db.query("delete from user_account");
  });
  after(() => {
    db.query("delete from user_account");
    // agent.close();
  });
  // Testing the register route
  describe("User Ebuka", () => {
    agent = chai.request.agent("https://thrift-production.up.railway.app");
    // agent = chai.request.agent("https://thrift-app-v2.onrender.com");
    it(`it should register Ebuka`, registration.bind(null, agent, Ebuka));
    it(`it should login Ebuka`, login.bind(null, agent, Ebuka));
    it(`it should logout Ebuka`, logout.bind(null, agent));
  });
}
