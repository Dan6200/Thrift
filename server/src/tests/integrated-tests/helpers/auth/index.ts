import chai from 'chai'
import { StatusCodes } from 'http-status-codes'
import { UserData } from '../../../../types-and-interfaces/user.js'

chai.should()

async function registration(agent: ChaiHttp.Agent, user: UserData) {
	const response = await agent.post('/v1/auth/register').send(user)
	response.should.have.status(StatusCodes.CREATED)
	response.body.should.be.an('object')
	const responseObject = response.body
	responseObject.should.have.property('token')
}

async function emailLogin(
	agent: ChaiHttp.Agent,
	{ email, password }: UserData,
	statusCode: StatusCodes
) {
	const response = await agent.post('/v1/auth/login').send({ email, password })
	response.should.have.status(statusCode)
	if (statusCode === StatusCodes.OK) {
		response.body.should.be.an('object')
	}
}

async function phoneLogin(
	agent: ChaiHttp.Agent,
	{ phone, password }: UserData,
	statusCode: StatusCodes
) {
	const response = await agent.post('/v1/auth/login').send({ phone, password })
	response.should.have.status(statusCode)
	if (statusCode === StatusCodes.OK) {
		response.body.should.be.an('object')
	}
}

async function logout(agent: ChaiHttp.Agent) {
	const response = await agent.get('/v1/auth/logout')
	response.should.have.status(StatusCodes.OK)
}

export { registration, emailLogin, phoneLogin, logout }
