import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import db from '../../../db/pg/index.js'
import { AccountData } from '../../../types-and-interfaces/account.js'
import {
  registration,
  emailLogin,
  phoneLogin,
  logout,
} from '../helper-functions/auth/index.js'
import { testFailToGetAccount } from '../helper-functions/user/index.js'

chai.use(chaiHttp).should()

export default function ({ accountInfo }: { accountInfo: AccountData }) {
  describe('User Account Authentication', () => {
    let token: string
    const server = process.env.PROD_APP_SERVER!
    before(async () => {
      await db.query({ text: 'delete from user_accounts' })
    })

    it('it should register the user', () => registration(server, accountInfo))

    it('it should login the user with email', () =>
      emailLogin(server, accountInfo, StatusCodes.OK))

    it('it should login the user with phone', () =>
      phoneLogin(server, accountInfo, StatusCodes.OK).then(
        ({ body: { token: resToken } }) => (token = resToken)
      ))

    describe('Testing logout', () => {
      before(() => {
        if (!token) {
          throw new Error('Token not set')
        }
      })

      it('it should logout the user', () => logout(server, token))

      it(`it should get an unauthorized error when trying to fetch the user`, () =>
        testFailToGetAccount(server, token, '/v1/account'))
    })
  })
}
