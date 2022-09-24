import { UserDataSchemaDB } from 'app-schema/users';
import application from 'application';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import { users, updateUser } from 'tests/authentication/user-data';
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp).should();
export default async function patchUser() {
	let n = 0;
	const userTokens: string[] = await users.getUserTokens();
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		const response = await chai
			.request(application)
			.patch('/api/v1/user/info')
			.send(updateUser[n])
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.OK);
		response.body.should.be.an('object');
		Joi.assert(response.body, UserDataSchemaDB);
		n++;
	}
}
