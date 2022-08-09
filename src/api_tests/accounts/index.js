require('express-async-errors')
const application		= require('../../app')
const chai				= require('chai')
const chaiHttp			= require('chai-http')
const db				= require('../../db')
const { StatusCodes }	= require('http-status-codes')
const { user, updatedUser }      = require('../authentication/test-data') 

chai.use(chaiHttp)
const should = chai.should()
, expect = chai.expect

const testGetUserAccount = () => {
	describe('/GET user account', () => {
		it ('it should retrieve the User account',
			async () => {
					for (const ID in user) {
						const response = await chai.request(application)
							.get('/api/v1/user-account')
							.auth(user[ID].token, { type: "bearer" })
						response.should.have.status(StatusCodes.OK)
						response.body.should.be.an('object')
						const responseData = response.body
						responseData.should.have.property('userAccount')
						const userAccount = responseData.userAccount
						userAccount.should.have.property('first_name')
						userAccount.should.have.property('last_name')
						userAccount.should.satisfy( account =>
							'email' in account || 'phone' in account
						)
						userAccount.should.have.property('ip_address')
						userAccount.should.have.property('country')
						userAccount.should.have.property('dob')
						userAccount.should.have.property('is_vendor')
						userAccount.should.have.property('is_customer')
						console.log(userAccount)
				}
			})
	})
}


const testUpdateUserAccount = () => {
	describe('/PATCH user account', () => {
		it ('it should update the user\'s account',
			async () => {
				let n = 0
				for (const ID in user) {
					const response = await chai.request (application)
						.patch('/api/v1/user-account')
						.send(updatedUser[n])
						.auth(user[ID].token, { type: "bearer" })
					response.should.have.status(StatusCodes.OK)
					response.body.should.be.an('object')
					const responseData = response.body
					responseData.should.have.property('updatedAccount')
					const updatedAccount = responseData.updatedAccount,
						fields = Object.keys(updatedUser[n])
					for ( const field of fields ) {
						if ( field.includes('assword') ) 
							updatedAccount.should.have.property ('password')
						else updatedAccount.should.have.property (field)
					}
					n++
				}
			}
		)
	})
}

const testCreateCustomerAccount = () => {
	describe('/POST: create customer account', () => {
		it ('it should create a customer account for the user',
			async () => {
				for (const ID in user) {
					const response = await chai.request(application)
						.post('/api/v1/user-account/customer')
						.send({ ID })
						.auth(user[ID].token, { type: "bearer" })
					response.should.have.status(StatusCodes.CREATED)
					response.body.should.be.an('object')
					const responseData = response.body
					responseData.should.have.property('newCustomerId')
					const { newCustomerId } = responseData
					newCustomerId.should.equal(ID)
				}
			})
	})
}

const testCreateVendorAccount = () => {
	describe('/POST: create vendor account', () => {
		it ('it should create a vendor account for the user',
			async () => {
				for (const ID in user) {
					const response = await chai.request(application)
						.post('/api/v1/user-account/vendor')
						.send({ ID })
						.auth(user[ID].token, { type: "bearer" })
					response.should.have.status(StatusCodes.CREATED)
					response.body.should.be.an('object')
					const responseData = response.body
					responseData.should.have.property('newVendorId')
					const { newVendorId } = responseData
					newVendorId.should.equal(ID)
				}
			})
	})
}

module.exports = {
	testGetUserAccount,
	testUpdateUserAccount,
	testCreateCustomerAccount,
	testCreateVendorAccount
}
