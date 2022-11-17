import chai from 'chai';
import chaiHttp from 'chai-http';
import { UserDataSchemaDB } from 'app-schema/users';
import application from 'application';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import {
	updateUser,
	updateUserPassword,
	userDataTesting,
} from 'tests/authentication/user-data';

chai.use(chaiHttp).should();

async function getUser() {
	const userTokens: string[] = await userDataTesting.get('tokens');
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

async function patchUser() {
	let n = 0;
	const userTokens: string[] = await userDataTesting.get('tokens');
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

async function patchUserPassword() {
	let n = 0;
	const userTokens: string[] = await userDataTesting.get('tokens');
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		let password = updateUserPassword[n++];
		const response = await chai
			.request(application)
			.patch('/api/v1/user/password')
			.send(password)
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.NO_CONTENT);
	}
}

let getDeletedUser = async () => {
	const userTokens: string[] = await userDataTesting.get('tokens');
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		const response = await chai
			.request(application)
			.get('/api/v1/user')
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.NOT_FOUND);
	}
};

async function deleteUser() {
	const userTokens: string[] = await userDataTesting.get('tokens');
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		const response = await chai
			.request(application)
			.delete('/api/v1/user')
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.OK);
	}
}

export { getUser, patchUser, patchUserPassword, getDeletedUser, deleteUser };
