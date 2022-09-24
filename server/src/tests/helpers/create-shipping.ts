async (addressIds: string[]) => {
	let count = 0;
	const userTokens: string[] = await users.getUserTokens();
	userTokens.should.not.be.empty;
	for (const userToken of userTokens) {
		const response = await chai
			.request(application)
			.post('/api/v1/user/customer/shipping-info')
			.send(newShippingData[count++])
			.auth(userToken, { type: 'bearer' });
		response.should.have.status(StatusCodes.CREATED);
		response.body.should.have.property('addressId');
		response.body.addressId.should.be.a('string');
		AddressId.push(response.body.addressId);
	}
};
