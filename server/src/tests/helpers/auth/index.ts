import chai from "chai";
import { StatusCodes } from "http-status-codes";
import { user } from "../../integrated-tests/user-data.js";

chai.should();

async function registration(agent: ChaiHttp.Agent, user: user) {
  const response = await agent.post("/v1/auth/register").send(user);
  response.should.have.status(StatusCodes.CREATED);
  response.body.should.be.an("object");
  const responseObject = response.body;
  responseObject.should.have.property("token");
}

async function emailLogin(
  agent: ChaiHttp.Agent,
  { email, password }: user,
  statusCode: StatusCodes
) {
  const response = await agent.post("/v1/auth/login").send({ email, password });
  response.should.have.status(statusCode);
  if (statusCode === StatusCodes.OK) {
    response.body.should.be.an("object");
    const responseObject = response.body;
    responseObject.should.have.property("token");
  }
}

async function phoneLogin(
  agent: ChaiHttp.Agent,
  { phone, password }: user,
  statusCode: StatusCodes
) {
  const response = await agent.post("/v1/auth/login").send({ phone, password });
  response.should.have.status(statusCode);
  if (statusCode === StatusCodes.OK) {
    response.body.should.be.an("object");
    const responseObject = response.body;
    responseObject.should.have.property("token");
  }
}

async function logout(agent: ChaiHttp.Agent) {
  const response = await agent.get("/v1/auth/logout");
  response.should.have.status(StatusCodes.OK);
}

export { registration, emailLogin, phoneLogin, logout };
