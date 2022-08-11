require('express-async-errors')
const application		= require('../../app'),
	 chai				= require('chai'),
	 chaiHttp			= require('chai-http'),
	 db					= require('../../db'),
	{ 
		newUsers, 
		loginUsers,
	}					= require('./test-data'),
	 { StatusCodes }	= require('http-status-codes'),
	 should				= chai.should()

let { user } 			= require('./test-data')

chai.use(chaiHttp)

const testRegistration = () => {
	beforeEach( async () => {
		//TODO: understand this!!!
		await db.query('delete from marketplace.user_account')
		console.log('deleted')
	})
	// Testing the register route
	describe ('/POST user: Registration', () => {
		it (`it should register ${newUsers.length} new users`,
			async () => {
				try {
					for (let i=0; i < newUsers.length; i++) {
						console.log(`\nUser ${i+1}: %o`, newUsers[i])
						const response = await chai.request(application)
							.post('/api/v1/auth/register')
							.send(newUsers[i])
						response.should.have.status(StatusCodes.CREATED)
						response.body.should.be.an('object')
						const responseObject = response.body
						console.log(`\nresponse %o`, responseObject)
						responseObject.should.have.property('newUser')
						responseObject.should.have.property('token')
						const { newUser, token } = responseObject
						const { user_id, phone, email } = newUser
						user[user_id] = { token }
					}
				} catch (error) {
					console.error(error)
				}
			}
		)
	})
}

const testLogin = count => {
	try {
		// Testing the login route
		const n = count - 1
		describe ('/POST user: Login', () => {
			beforeEach( () => {
				// clear the saved user tokens before registration
				// user = {}
				// console.log('runs')
			})
			const noOfUsers = loginUsers[n].length
			it (`it should login ${noOfUsers} users`, async () => {
				for (let i=0; i < noOfUsers; i++) {
					console.log(`\nUser ${i+1}: %o`, loginUsers[n][i])
					const response = await chai.request(application)
						.post('/api/v1/auth/login')
						.send(loginUsers[n][i])
					response.should.have.status(StatusCodes.OK)
					response.body.should.be.an('object')
					const responseObject = response.body
					console.log(`\nresponse %o`, responseObject)
					responseObject.should.have.property('userId')
					responseObject.should.have.property('token')
					const { userId, token } = responseObject
					user[userId] = { token }
				}
			})
		})
	} catch (error) {
		console.error(error)
	}
}

module.exports = {
	testRegistration,
	testLogin,
}
