import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import { request } from './helpers.js'

chai.use(chaiHttp).should()

const { UNAUTHORIZED } = StatusCodes

const GARBAGE_TOKEN = 'garbage.token.value.that.is.not.a.real.jwt'

export default function () {
  describe('Adversarial: Authentication', () => {
    const endpoints = [
      ['get', '/v1/me'],
      ['get', '/v1/stores'],
      ['get', '/v1/cart'],
      ['get', '/v1/orders'],
      ['get', '/v1/delivery-info'],
    ] as const

    // NOTE: GET /v1/products is a public catalog endpoint and intentionally
    // requires no auth, so it is deliberately excluded from this list.

    for (const [verb, path] of endpoints) {
      it(`rejects a garbage token on ${verb.toUpperCase()} ${path}`, async () => {
        const res = await request(verb, path, { token: GARBAGE_TOKEN })
        res.should.have.status(UNAUTHORIZED)
      })
    }

    it('rejects a garbage token on a write endpoint', async () => {
      const res = await request('post', '/v1/stores', {
        token: GARBAGE_TOKEN,
        body: { store_name: 'x' },
      })
      res.should.have.status(UNAUTHORIZED)
    })

    it('rejects an empty bearer token on /v1/me', async () => {
      const res = await request('get', '/v1/me', { token: '' })
      res.should.have.status(UNAUTHORIZED)
    })
  })
}
