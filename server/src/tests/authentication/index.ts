//cspell:disable
import chai from "chai";
import chaiHttp from "chai-http";
import db from "../../db";
import { login, logout } from "../helpers/auth/login";
import registration from "../helpers/auth/registration";
import { Ebuka } from "./user-data";

chai.use(chaiHttp).should();

export default function (): void {
  before(() => {
    // deletes all entries from user_account
    db.query("delete from user_account").catch((err) => console.error(err));
  });
  after(() => {
    db.query("delete from user_account");
  });
  // Testing the register route
  describe("User Ebuka", () => {
    const agent = chai.request.agent("https://thrift-app-z915.onrender.com");
    it(`it should register Ebuka`, registration.bind(null, agent, Ebuka));
    it(`it should login Ebuka`, login.bind(null, agent, Ebuka));
    it(`it should logout Ebuka`, logout.bind(null, agent));
    console.log(agent);
    agent.close();
  });
}
