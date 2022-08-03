require('express-async-errors')
const application		= require('../../app')
const chai				= require('chai')
const chaiHttp			= require('chai-http')
const db				= require('../../db')
const { customerAccount,
	vendorAccount}		= require('./test-data')
const { StatusCodes }	= require('http-status-codes')
const { token } 	 	= require('../authentication')

chai.use(chaiHttp)
const should = chai.should()
, expect = chai.expect

const testUserAccount = () => {
	describe('/GET user account', () => {
		it ('it should retrieve the User account',
			async () => {
					for (id in token) {
					const response = await chai.request(application)
						.get('/api/v1/user-account')
						.auth(token[id], { type: "bearer" })
					response.should.have.status(StatusCodes.OK)
					response.body.should.be.an('object')
					const responseObject = response.body
					responseObject.should.have.property('userAccount')
					const userAccount = accounts.userAccount
					userAccount.should.have.property('userId')
					userAccount.should.have.property('userId')
					userAccount.should.have.property('userId')
					userAccount.should.have.property('userId')
					userAccount.should.have.property('userId')
					userAccount.should.have.property('userId')
					console.log(responseObject)
				}
			})
	})
}

const testCreateCustomerAccount = () => {
	beforeEach(() => {
		db.query('delete from ecommerce_app.customer')
	})
	describe('/POST: create customer account', () => {
		it ('it should create a customer account for the user',
			async () => {
				for (id in token) {
					const response = await chai.request(application)
						.post('/api/v1/user-accounts/customer')
						.send({
							id,
							currency: 'NGN'
						})
						.auth(token[id], { type: "bearer" })
					response.should.have.status(StatusCodes.CREATED)
					response.body.should.be.an('object')
					const responseObject = response.body
					responseObject.should.have.property('userAccount')
					const userAccount = responseObject.userAccount
					userAccount.should.have.property('userId')
					userAccount.should.have.property('firstName')
					userAccount.should.have.property('initials')
					responseObject.should.have.property('newCustomerAccount')
					const newCustomerAccount = responseObject.newCustomerAccount
					newCustomerAccount.should.have.property('customer_id')
					newCustomerAccount.should.have.property('currency')
					console.log(responseObject)
				}
			})
	})
}

const testCreateVendorAccount = () => {
	beforeEach(() => {
		db.query('delete from ecommerce_app.vendor')
	})
	describe('/POST: create vendor account', () => {
		it ('it should create a vendor account for the user',
			async () => {
				for (id in token) {
					const response = await chai.request(application)
						.post('/api/v1/user-accounts/vendor')
						.send({ id })
						.auth(token[id], { type: "bearer" })
					response.should.have.status(StatusCodes.CREATED)
					response.body.should.be.an('object')
					const responseObject = response.body
					responseObject.should.have.property('userAccount')
					const userAccount = responseObject.userAccount
					userAccount.should.have.property('userId')
					responseObject.should.have.property('newVendorAccount')
					const newVendorAccount = responseObject.newVendorAccount
					newVendorAccount.should.have.property('vendor_id')
					console.log(responseObject)
				}
			})
	})
}

module.exports = {
	testGetAllAccounts,
	testCreateCustomerAccount,
	testCreateVendorAccount
}
