import chai from "chai";
import { StatusCodes } from "http-status-codes";
import { user } from "../../authentication/user-data";

chai.should();

async function login(agent: ChaiHttp.Agent, { email, password }: user) {
  const response = await agent
    .post("/api/v1/auth/login")
    .send({ email, password });
  response.should.have.status(StatusCodes.CREATED);
  response.body.should.be.an("object");
  const responseObject = response.body;
  responseObject.should.have.property("token");
}

async function logout(agent: ChaiHttp.Agent) {
  const response = await agent.get("/api/v1/auth/logout");
  response.should.have.status(StatusCodes.OK);
}

export { login, logout };
