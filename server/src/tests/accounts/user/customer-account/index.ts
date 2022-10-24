import 'express-async-errors';
import chai from 'chai';
import chaiHttp from 'chai-http';
import {
	createCustomerAccount,
	getCustomerAccount,
	updateCustomerAccount,
	deleteCustomerAccount,
	getDeletedCustomerAccount,
} from 'tests/helpers/user/customer-account';
chai.use(chaiHttp).should();

export default function testCustomerAccount() {
	describe('/POST customer account', () => {
		it(`it should create new customer accounts`, createCustomerAccount);
	});
	describe('/GET customer account', () => {
		it(`it should retrieve the customer account`, getCustomerAccount);
	});
	describe('/PATCH customer account', () => {
		it('it should update the customer account info', updateCustomerAccount);
	});
	describe('/DELETE customer account', () => {
		it("it should delete the customer's account", deleteCustomerAccount);
	});
	describe('/GET customer', () => {
		it(
			`it should fail to retrieve the customer account`,
			getDeletedCustomerAccount
		);
	});
}
