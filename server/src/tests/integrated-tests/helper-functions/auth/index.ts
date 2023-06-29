import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import { AccountData } from '../../../../types-and-interfaces/account.js'

chai.use(chaiHttp).should()

async function registration(server: string, user: AccountData) {
	const response = await chai
		.request(server)
		.post('/v1/auth/register')
		.send(user)
	response.should.have.status(StatusCodes.CREATED)
	response.body.should.be.an('object')
	response.body.should.have.property('token')
	return response
}

async function emailLogin(
	server: string,
	{ email, password }: AccountData,
	statusCode: StatusCodes
) {
	const response = await chai
		.request(server)
		.post('/v1/auth/login')
		.send({ email, password })
	response.should.have.status(statusCode)
	response.body.should.be.an('object')
	return response
}

async function phoneLogin(
	server: string,
	{ phone, password }: AccountData,
	statusCode: StatusCodes
) {
	const response = await chai
		.request(server)
		.post('/v1/auth/login')
		.send({ phone, password })
	response.should.have.status(statusCode)
	response.body.should.be.an('object')
	return response
}

async function logout(server: string, token: string) {
	const response = await chai
		.request(server)
		.get('/v1/auth/logout')
		.auth(token, { type: 'bearer' })
	response.should.have.status(StatusCodes.OK)
	return response
}

export { registration, emailLogin, phoneLogin, logout }
