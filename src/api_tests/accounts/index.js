require('express-async-errors')
const application		= require('../../app')
	chai				= require('chai'),
	chaiHttp			= require('chai-http'),
	db				= require('../../db'),
	{ StatusCodes }	= require('http-status-codes'),
	{ user, updatedUser }      = require('../authentication/test-data'),
	{ NotFoundError }  = require('../../errors')

chai.use(chaiHttp)
const should = chai.should()
, expect = chai.expect

const testGetUserAccount = () => {
	describe('/GET user account', () => {
		it ('it should retrieve the User account',
			async () => {
				try {
					for (const ID in user) {
						const response = await chai.request(application)
							.get('/qi/v1/user-account')
							.auth(user[ID].token, { type: "bearer" })
						response.should.have.status(StatusCodes.OK)
						response.body.should.be.an('object')
						const responseData = response.body
						console.log(`\n\t\tUser ID: ${ID}, response %o`, responseData)
						responseData.should.have.property('userAccount')
						const userAccount = responseData.userAccount
						// User id accessed by the payload
						// userAccount.userId.should.equal(ID)
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
					}
				} catch (error) {
					console.error(error)
					throw error
				}
			})
	})
}


const testUpdateUserAccount = () => {
	describe('/PATCH user account', () => {
		it ('it should update the user\'s account',
			async () => {
				try {
					let n = 0
					for (const ID in user) {
						console.log(`\nUser ID: ${ID}, Data: %o`, updatedUser[n])
						const response = await chai.request (application)
							.patch('/api/v1/user-account')
							.send(updatedUser[n])
							.auth(user[ID].token, { type: "bearer" })
						response.should.have.status(StatusCodes.OK)
						response.body.should.be.an('object')
						const responseData = response.body
						console.log(`response %o`, responseData)
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
				} catch (error) {
					console.error(error)
					throw error
				}
			}
		)
	})
}

const testDeleteUserAccount = () => {
	describe('/DELETE user account', () => {
		it ('it should delete the user\'s account',
			async () => {
				try {
					for (const ID in user) {
						const response = await chai.request(application)
							.delete('/api/v1/user-account')
							.auth(user[ID].token, { type: "bearer" })
						response.should.have.status(StatusCodes.OK)
					}
				} catch (error) {
					console.error(error)
					throw error
				}
			}
		)
	})
}

const testCreateCustomerAccount = () => {
	describe('/POST: create customer account', () => {
		it ('it should create a customer account for the user',
			async () => {
				try {
					for (const ID in user) {
						console.log(`\n\t\tUser ID: ${ID}, Data: %o`, user[ID])
						const response = await chai.request(application)
							.post('/api/v1/user-account/customer')
							.send({ ID })
							.auth(user[ID].token, { type: "bearer" })
						response.should.have.status(StatusCodes.CREATED)
						response.body.should.be.an('object')
						const responseData = response.body
						console.log(`response %o`, responseData)
						responseData.should.have.property('newCustomerId')
						const { newCustomerId } = responseData
						newCustomerId.should.equal(ID)
					}
				} catch (error) {
					console.error(error)
					throw error
				}
			})
	})
}

const testCreateVendorAccount = () => {
	describe('/POST: create vendor account', () => {
		it ('it should create a vendor account for the user',
			async () => {
				try {
					for (const ID in user) {
						console.log(`\nUser ID: ${ID}, Data %o`, user[ID])
						const response = await chai.request(application)
							.post('/api/v1/user-account/vendor')
							.send({ ID })
							.auth(user[ID].token, { type: "bearer" })
						response.should.have.status(StatusCodes.CREATED)
						response.body.should.be.an('object')
						const responseData = response.body
						console.log(`response %o`, responseData)
						responseData.should.have.property('newVendorId')
						const { newVendorId } = responseData
						newVendorId.should.equal(ID)
					}
				} catch (error) {
					console.error(error)
					throw error
				}
			})
	})
}

const testGetUserAccountAfterDelete = () => {
	describe('/GET user account after delete', () => {
		it ('it should fail to retrieve the User account',
			async () => {
				try {
					for (const ID in user) {
						const response = await chai.request(application)
							.get('/api/v1/user-account')
							.auth(user[ID].token, { type: "bearer" })
					}
				} catch (error) {
					error.should.have.status(StatusCodes.NOT_FOUND)
				}
			})
	})
}

module.exports = {
	testGetUserAccount,
	testUpdateUserAccount,
	testCreateCustomerAccount,
	testDeleteUserAccount,
	testGetUserAccountAfterDelete,
	testCreateVendorAccount,
}
