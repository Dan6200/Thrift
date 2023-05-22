import chai from "chai";
import fs from "fs";
import { StatusCodes } from "http-status-codes";
import { user } from "../../authentication/user-data";

chai.should();

export default async function registration(agent: ChaiHttp.Agent, user: user) {
  const response = await agent.post("/api/v1/auth/register").send(user);
  response.should.have.status(StatusCodes.CREATED);
  response.body.should.be.an("object");
  const responseObject = response.body;
  responseObject.should.have.property("token");
  const { token } = responseObject;
  fs.writeFileSync("./token.txt", token);
}
