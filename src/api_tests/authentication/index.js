require('express-async-errors')
const application		= require('../../app')
const chai				= require('chai')
const chaiHttp			= require('chai-http')
const db				= require('../../db')
const { 
	newUsers, 
	loginUsers,
	user,
}						= require('./test-data')
const { StatusCodes }	= require('http-status-codes')

chai.use(chaiHttp)
const should = chai.should()

const testRegistration = () => {
	beforeEach( async () => {
		await db.query('delete from marketplace.user_account')
	})
	// Testing the register route
	describe ('/POST user: Registration', () => {
		it (`it should register ${newUsers.length} new users`, async () => {
			for (let i=0; i < newUsers.length; i++) {
				const response = await chai.request(application)
					.post('/api/v1/auth/register')
					.send(newUsers[i])
				response.should.have.status(StatusCodes.CREATED)
				response.body.should.be.an('object')
				const responseObject = response.body
				responseObject.should.have.property('newUserId')
				responseObject.should.have.property('token')
				const { newUserId, token } = responseObject
				user[newUserId] = { token }
			}
		})
	})
}

const testLogin = count => {
	// Testing the login route
	for (let n=0; n < count; n++) {
		describe ('/POST user: Login', () => {
			const noOfUsers = loginUsers[n].length
			it (`it should login ${noOfUsers} users`, async () => {
				for (let i=0; i < noOfUsers; i++) {
					const response = await chai.request(application)
						.post('/api/v1/auth/login')
						.send(loginUsers[n][i])
					response.should.have.status(StatusCodes.OK)
					response.body.should.be.an('object')
					const responseObject = response.body
					responseObject.should.have.property('userId')
					responseObject.should.have.property('token')
					const { userId, token } = responseObject
					user[userId] = { token }
				}
			})
		})
	}
}

module.exports = {
	testRegistration,
	testLogin,
}
