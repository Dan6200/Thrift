import "express-async-errors";
import chai from "chai";
import chaiHttp from "chai-http";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { load } from "js-yaml";
import { UserData } from "../../../types-and-interfaces/user.js";
import {
  testGetUser,
  testUpdateUser,
  testChangeUserPassword,
  testDeleteUser,
  testDontGetUser,
  testGetNonExistentUser,
} from "../../helpers/user/index.js";
import { StatusCodes } from "http-status-codes";
import { emailLogin, logout } from "../../helpers/auth/index.js";

chai.use(chaiHttp).should();

const newUsersYaml = fileURLToPath(
  new URL("../../data/users/new-users.yaml", import.meta.url)
);
const newUsers = load(readFileSync(newUsersYaml, "utf8")) as UserData[];

const updateUsersYaml = fileURLToPath(
  new URL("../../data/users/update-user.yaml", import.meta.url)
);
const usersInfoUpdated = load(
  readFileSync(updateUsersYaml, "utf8")
) as UserData[];

const updateUsersPasswordsYaml = fileURLToPath(
  new URL("../../data/users/update-user-password.yaml", import.meta.url)
);
const usersPasswordsUpdated = load(
  readFileSync(updateUsersPasswordsYaml, "utf8")
) as UserData[];

export default function (agent: ChaiHttp.Agent, index: number) {
  it("it should get the user's account", () => testGetUser(agent));

  const updatedUserInfo = usersInfoUpdated[index];

  it("it should update the user's account", () =>
    testUpdateUser(agent, updatedUserInfo));

  const updatedUserPassword = usersPasswordsUpdated[index];

  it("it should change the user's password", () =>
    testChangeUserPassword(agent, updatedUserPassword));

  it("it should delete the user's account", () => testDeleteUser(agent));

  it("it should fail to get user's account", () =>
    testGetNonExistentUser(agent));

  it("it should logout user", () => logout(agent));

  const user = newUsers[index];

  it("it should fail to login user", () =>
    emailLogin(agent, user, StatusCodes.UNAUTHORIZED));
}
