require('express-async-errors')
const application		= require('../../app')
const chai				= require('chai')
const chaiHttp			= require('chai-http')
const db				= require('../../db')
const { newUsers, users }		= require('./test-data')
const { StatusCodes }	= require('http-status-codes')

chai.use(chaiHttp)
const should = chai.should()
let token = {}

const testRegistration = () => {
	beforeEach( async () => {
		await db.query('delete from ecommerce_app.user_account')
	})
	// Testing the register route
	describe ('/POST user: Registration', () => {
		it ('it should register 2 new users', async () => {
			for (let i=0; i < newUsers.length; i++) {
				const response = await chai.request(application)
					.post('/api/v1/auth/register')
					.send(newUsers[i])
				response.should.have.status(StatusCodes.CREATED)
				response.body.should.be.an('object')
				const responseObject = response.body
				responseObject.should.have.property('newUserId')
				responseObject.should.have.property('token')
				const { newUserId, token: responseToken } = responseObject
				token[newUserId] = responseToken
			}
		})
	})
}

const testLogin = () => {
	// Testing the login route
	describe ('/POST user: Login', () => {
		it ('it should login 2 users', async () => {
			for (let i=0; i < users.length; i++) {
				const response = await chai.request(application)
					.post('/api/v1/auth/login')
					.send(users[i])
				response.should.have.status(StatusCodes.OK)
				response.body.should.be.an('object')
				const responseObject = response.body
				responseObject.should.have.property('userId')
				responseObject.should.have.property('token')
				const { userId, token: responseToken } = responseObject
				token[userId] = responseToken
			}
		})
	})
}

module.exports = {
	testRegistration,
	testLogin,
	token
}
