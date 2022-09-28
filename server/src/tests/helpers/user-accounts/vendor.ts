import chai from 'chai';
import chaiHttp from 'chai-http';
import application from 'application';
import { StatusCodes } from 'http-status-codes';
import { users } from 'tests/authentication/user-data';

chai.use(chaiHttp).should();

async function createVendor() {
	const userTokens: string[] = await users.getUserTokens();
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		const response = await chai
			.request(application)
			.post('/api/v1/user/vendor')
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.OK);
		response.body.should.be.an('object');
		response.body.should.have.property('vendor_id');
	}
}

async function getVendor() {
	const userTokens: string[] = await users.getUserTokens();
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		const response = await chai
			.request(application)
			.get('/api/v1/user/vendor')
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.OK);
		response.body.should.be.an('object');
		response.body.should.have.property('vendor_id');
	}
}

async function updateVendor() {
	const userTokens: string[] = await users.getUserTokens();
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		const response = await chai
			.request(application)
			.patch('/api/v1/user/vendor')
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.NO_CONTENT);
		response.body.should.be.empty;
	}
}

let getDeletedVendor = async () => {
	const userTokens: string[] = await users.getUserTokens();
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		const response = await chai
			.request(application)
			.get('/api/v1/user/vendor')
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.NOT_FOUND);
	}
};

async function deleteVendor() {
	const userTokens: string[] = await users.getUserTokens();
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		const response = await chai
			.request(application)
			.delete('/api/v1/user/vendor')
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.NO_CONTENT);
		response.body.should.be.empty;
	}
}

export {
	createVendor,
	getVendor,
	updateVendor,
	getDeletedVendor,
	deleteVendor,
};
