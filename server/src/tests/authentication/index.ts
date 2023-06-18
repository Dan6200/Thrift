import 'express-async-errors'
import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import {
	registration,
	phoneLogin,
	emailLogin,
	logout,
} from '../helpers/auth/index.js'
import { UserData } from '../../types-and-interfaces/user.js'
import db from '../../db/index.js'

chai.use(chaiHttp).should()

export default function (
	agent: ChaiHttp.Agent,
	{ userInfo }: { userInfo: UserData }
) {
	after(async () => db.query('delete from user_accounts'))

	it('it should register the user', () => registration(agent, userInfo))

	it('it should login the user with email', () =>
		emailLogin(agent, userInfo, StatusCodes.OK))

	it('it should login the user with phone', () =>
		phoneLogin(agent, userInfo, StatusCodes.OK))

	it('it should logout the user', () => logout(agent))
}
