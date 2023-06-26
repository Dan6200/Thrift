import 'dotenv'
import chai from 'chai'
import chaiHttp from 'chai-http'
import {
	testGetUser,
	testUpdateUser,
	testChangeUserPassword,
	testDeleteUser,
	testFailToGetUser,
	testGetNonExistentUser,
} from '../../helpers/user/index.js'
import { StatusCodes } from 'http-status-codes'
import { emailLogin, logout, registration } from '../../helpers/auth/index.js'
import db from '../../../../db/pg/index.js'
import { UserData } from '../../../../types-and-interfaces/user.js'

chai.use(chaiHttp).should()

// Set server url
const server = process.env.LOCAL_APP_SERVER!

export default function ({
	userInfo,
	updatedUserInfo,
	updatedPassword,
}: {
	userInfo: UserData
	updatedUserInfo: UserData
	updatedPassword: UserData
}) {
	const path = '/v1/users'
	let token: string
	describe('User account management', () => {
		before(async () => {
			// Delete all user accounts
			await db.query({ text: 'delete from user_accounts' })
			// Create a new user for each tests
			const response = await registration(server, userInfo)
			// Store the token returned
			token = response.body.token
		})

		it("it should get the user's account", () =>
			testGetUser(server, token, path))

		it("it should update the user's account", () =>
			testUpdateUser(server, token, path, updatedUserInfo))

		it("it should change the user's password", () =>
			testChangeUserPassword(
				server,
				token,
				path + '/password',
				updatedPassword
			))

		it("it should delete the user's account", () =>
			testDeleteUser(server, token, path))

		it("it should fail to get user's account", () =>
			testGetNonExistentUser(server, token, path))

		it('it should logout user', () => logout(server, token))

		it('it should fail to login the deleted user', () =>
			emailLogin(server, userInfo, StatusCodes.UNAUTHORIZED))
	})
}
