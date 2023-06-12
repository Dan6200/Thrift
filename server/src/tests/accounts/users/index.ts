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
import { emailLogin, logout, registration } from "../../helpers/auth/index.js";

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
  const user = newUsers[index],
    path = "/v1/user";

  it("it should get an unauthorized error when trying to fetch the user", () =>
    testDontGetUser(agent, path));

  it("it should login user", () => emailLogin(agent, user, StatusCodes.OK));

  it("it should get the user's account", () => testGetUser(agent, path));

  const updatedUserInfo = usersInfoUpdated[index];

  it("it should update the user's account", () =>
    testUpdateUser(agent, path, updatedUserInfo));

  const updatedUserPassword = usersPasswordsUpdated[index];

  it("it should change the user's password", () =>
    testChangeUserPassword(agent, path + "/password", updatedUserPassword));

  it("it should delete the user's account", () => testDeleteUser(agent, path));

  it("it should fail to get user's account", () =>
    testGetNonExistentUser(agent, path));

  it("it should logout user", () => logout(agent));

  it("it should fail to login the deleted user", () =>
    emailLogin(agent, user, StatusCodes.UNAUTHORIZED));

  it("it should register the user, for subsequent tests", () =>
    registration(agent, user));
}
