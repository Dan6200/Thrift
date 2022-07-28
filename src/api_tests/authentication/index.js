require('express-async-errors')
const application		= require('../../app')
const chai				= require('chai')
const chaiHttp			= require('chai-http')
const db				= require('../../db')
const { newUsers, users }		= require('./test-data')
const { StatusCodes }	= require('http-status-codes')
const should = chai.should()
let token = {}

chai.use(chaiHttp)

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
				response.body.should.have.property('newUser')
				response.body.should.have.property('token')
				response.body.newUser.should.have.property('userId')
				response.body.newUser.should.have.property('name')
				response.body.newUser.should.have.property('initials')
				token[response.body.newUser.userId] = response.body.token
			}
		})
	})
}

const testLogin = () => {
	describe ('/POST user: Login', () => {
		it ('it should login 2 users', async () => {
			for (let i=0; i < users.length; i++) {
				const response = await chai.request(application)
					.post('/api/v1/auth/login')
					.send(users[i])
				response.should.have.status(StatusCodes.OK)
				response.body.should.be.an('object')
				response.body.should.have.property('user')
				response.body.should.have.property('token')
				response.body.user.should.have.property('userId')
				response.body.user.should.have.property('name')
				response.body.user.should.have.property('initials')
				token[response.body.user.userId] = response.body.token
			}
		})
	})
}

module.exports = {
	testRegistration,
	testLogin,
	token
}
