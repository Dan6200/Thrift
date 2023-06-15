import 'express-async-errors'
import chai from 'chai'
import chaiHttp from 'chai-http'
import {
	testGetUser,
	testUpdateUser,
	testChangeUserPassword,
	testDeleteUser,
	testDontGetUser,
	testGetNonExistentUser,
} from '../../helpers/user/index.js'
import { StatusCodes } from 'http-status-codes'
import { emailLogin, logout, registration } from '../../helpers/auth/index.js'
import {
	newUsers,
	usersInfoUpdated,
	usersPasswordsUpdated,
} from '../../helpers/load-yaml.js'
import db from '../../../db/index.js'

chai.use(chaiHttp).should()

export default function (agent: ChaiHttp.Agent, index: number) {
	after(async () => db.query('delete from user_accounts'))

	const user = newUsers[index],
		path = '/v1/user-account'

	it('it should register a user', () => registration(agent, user))

	it('it should logout user', () => logout(agent))

	it('it should get an unauthorized error when trying to fetch the user', () =>
		testDontGetUser(agent, path))

	it('it should login user', () => emailLogin(agent, user, StatusCodes.OK))

	it("it should get the user's account", () => testGetUser(agent, path))

	const updatedUserInfo = usersInfoUpdated[index]

	it("it should update the user's account", () =>
		testUpdateUser(agent, path, updatedUserInfo))

	const updatedUserPassword = usersPasswordsUpdated[index]

	it("it should change the user's password", () =>
		testChangeUserPassword(agent, path + '/password', updatedUserPassword))

	it("it should delete the user's account", () => testDeleteUser(agent, path))

	it("it should fail to get user's account", () =>
		testGetNonExistentUser(agent, path))

	it('it should logout user', () => logout(agent))

	it('it should fail to login the deleted user', () =>
		emailLogin(agent, user, StatusCodes.UNAUTHORIZED))
}
