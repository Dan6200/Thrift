import application from 'application';
import { StatusCodes } from 'http-status-codes';
import { newShippingData } from 'tests/accounts/customer-account/shipping-data';
import { users } from 'tests/authentication/user-data';
import chai from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp).should();

export default async (addressIds: string[]) => {
	let count = 0;
	const userTokens: string[] = await users.getUserTokens();
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		console.log('hey');
		const response = await chai
			.request(application)
			.post('/api/v1/user/customer/shipping-info')
			.send(newShippingData[count++])
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.CREATED);
		response.body.should.have.property('addressId');
		response.body.addressId.should.be.a('string');
		addressIds.push(response.body.addressId);
	}
};
