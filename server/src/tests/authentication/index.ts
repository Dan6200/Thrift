import "express-async-errors";
import chai from "chai";
import chaiHttp from "chai-http";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { load } from "js-yaml";
import { StatusCodes } from "http-status-codes";
import {
  registration,
  phoneLogin,
  emailLogin,
  logout,
} from "../helpers/auth/index.js";
import { UserData } from "../../types-and-interfaces/user.js";

chai.use(chaiHttp).should();

const newUsersYaml = fileURLToPath(
  new URL("../data/users/new-users.yaml", import.meta.url)
);
const newUsers = load(readFileSync(newUsersYaml, "utf8")) as UserData[];

export default function (agent: ChaiHttp.Agent, index: number) {
  const user = newUsers[index];

  it("it should register the user", () => registration(agent, user));

  it("it should login the user with email", () =>
    emailLogin(agent, user, StatusCodes.OK));

  it("it should login the user with phone", () =>
    phoneLogin(agent, user, StatusCodes.OK));

  it("it should logout the user", () => logout(agent));
}
