import chai from "chai";
import { Express } from "express";
import chaiHttp from "chai-http";
chai.use(chaiHttp).should();

export default async (
  server: string | Express,
  verb: string,
  path: string,
  token?: string,
  data?: object
) => {
  return await chai
    .request(server)
    [verb](path)
    .send(data)
    .auth(token, { type: "bearer" });
};
