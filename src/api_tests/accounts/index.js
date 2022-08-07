require('express-async-errors')
const application		= require('../../app')
const chai				= require('chai')
const chaiHttp			= require('chai-http')
const db				= require('../../db')
const { StatusCodes }	= require('http-status-codes')
const { token } 	 	= require('../authentication')

chai.use(chaiHttp)
const should = chai.should()
, expect = chai.expect

const testGetUserAccount = () => {
	describe('/GET user account', () => {
		it ('it should retrieve the User account',
			async () => {
					for (id in token) {
						const response = await chai.request(application)
							.get('/api/v1/user-account')
							.auth(token[id], { type: "bearer" })
						response.should.have.status(StatusCodes.OK)
						response.body.should.be.an('object')
						const responseData = response.body
						responseData.should.have.property('userAccount')
						const userAccount = responseData.userAccount
						userAccount.should.have.property('user_id')
						userAccount.should.have.property('first_name')
						userAccount.should.have.property('last_name')
						userAccount.should.satisfy( account =>
							'email' in account || 'phone' in account
						)
						userAccount.should.have.property('ip_address')
						userAccount.should.have.property('country')
						userAccount.should.have.property('dob')
						userAccount.should.satisfy( account =>
							('vendor_id' in account 
								|| 'customer_id' in account)
						)
				}
			})
	})
}

const testCreateCustomerAccount = () => {
	beforeEach(() => {
		db.query('delete from marketplace.customer')
	})
	describe('/POST: create customer account', () => {
		it ('it should create a customer account for the user',
			async () => {
				for (id in token) {
					const response = await chai.request(application)
						.post('/api/v1/user-account/customer')
						.send({ id })
						.auth(token[id], { type: "bearer" })
					response.should.have.status(StatusCodes.CREATED)
					response.body.should.be.an('object')
					const responseData = response.body
					responseData.should.have.property('newCustomerId')
					const { newCustomerId } = responseData
					newCustomerId.should.equal(id)
				}
			})
	})
}

const testCreateVendorAccount = () => {
	beforeEach(() => {
		db.query('delete from marketplace.vendor')
	})
	describe('/POST: create vendor account', () => {
		it ('it should create a vendor account for the user',
			async () => {
				for (id in token) {
					const response = await chai.request(application)
						.post('/api/v1/user-account/vendor')
						.send({ id })
						.auth(token[id], { type: "bearer" })
					response.should.have.status(StatusCodes.CREATED)
					response.body.should.be.an('object')
					const responseData = response.body
					responseData.should.have.property('newVendorId')
					const { newVendorId } = responseData
					newVendorId.should.equal(id)
				}
			})
	})
}

module.exports = {
	testGetUserAccount,
	testCreateCustomerAccount,
	testCreateVendorAccount
}
