import { UserDataSchemaDB } from 'app-schema/users';
import application from 'application';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import { users } from 'tests/authentication/user-data';

export default async function getUser() {
	const userTokens: string[] = await users.getUserTokens();
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		const response = await chai
			.request(application)
			.get('/api/v1/user')
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.OK);
		response.body.should.be.an('object');
		Joi.assert(response.body, UserDataSchemaDB);
	}
}
