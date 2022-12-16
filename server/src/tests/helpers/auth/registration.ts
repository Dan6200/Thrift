import chai from 'chai';
import chaiHttp from 'chai-http';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import app from '../../../app';
import { newUsers } from '../../authentication/user-data';

chai.use(chaiHttp).should();
export default async function registration() {
	let lastUser: Object = {},
		tokens: string[] = [];
	for (let i = 0; i < newUsers.length; i++) {
		const newUser = newUsers[i];
		newUser.should.not.be.equal(lastUser);
		// save passwords for testing login and changing passwords
		const response = await chai
			.request(app)
			.post('/api/v1/auth/register')
			.send(newUser);
		response.should.have.status(StatusCodes.CREATED);
		response.body.should.be.an('object');
		const responseObject = response.body;
		responseObject.should.have.property('token');
		const { token } = responseObject;
		fs.writeFileSync('./token.txt', token);
		tokens.push(token);
		lastUser = newUser;
	}
	return tokens;
}
