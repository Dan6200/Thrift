import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'

chai.use(chaiHttp).should()

const { BAD_REQUEST, NOT_FOUND } = StatusCodes
const callbackPath = '/v1/payments/callback'

/**
 * The Paystack callback endpoint is unauthenticated (Paystack calls it). An
 * unknown reference cannot be fulfilled without a live Paystack transaction, so
 * only the request-validation + not-found boundary is exercised here; the
 * orchestration is covered by the `handleCallbackUseCase` unit test.
 */
export default function () {
  describe('Testing Payments Callback', () => {
    it('rejects a callback with no reference', async () => {
      const res = await chai.request(process.env.SERVER!).get(callbackPath)
      res.should.have.status(BAD_REQUEST)
    })

    it('returns 404 for an unknown payment reference', async () => {
      const res = await chai
        .request(process.env.SERVER!)
        .get(callbackPath)
        .query({ reference: 'unknown-reference-for-test' })
      res.should.have.status(NOT_FOUND)
    })
  })
}
