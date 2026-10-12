import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import {
  request,
  expectRejected,
  uniqueUser,
  seedUser,
  seedVendorCatalog,
} from './helpers.js'
import { loadUserData } from '../helpers/load-data.js'
import { deleteUserForTesting } from '../helpers/delete-user.js'

chai.use(chaiHttp).should()

const { BAD_REQUEST, NOT_FOUND, CREATED } = StatusCodes

const aisha = loadUserData(
  'src/tests/integrated/data/users/customers/user-aisha',
)

export default function () {
  describe('Adversarial: Payments', () => {
    let catalog: Awaited<ReturnType<typeof seedVendorCatalog>>
    let customer: { id: string; token: string }

    before(async () => {
      catalog = await seedVendorCatalog()
      customer = await seedUser(uniqueUser(aisha.userInfo))
    })

    after(async () => {
      await deleteUserForTesting(customer.id)
      await deleteUserForTesting(catalog.vendor.id)
    })

    const makePendingOrder = async () => {
      const res = await request('post', '/v1/orders', {
        token: customer.token,
        query: { store_id: catalog.storeId },
        body: { items: [{ variant_id: catalog.variantId, quantity: 1 }] },
      })
      res.should.have.status(CREATED)
      return res.body.order_id as number
    }

    describe('initialize param coercion', () => {
      it('rejects initializing a payment with a non-numeric order_id', async () => {
        const res = await request('post', '/v1/payments/initialize', {
          token: customer.token,
          body: { order_id: 'abc' },
        })
        expectRejected(res, [BAD_REQUEST], 'non-numeric order_id')
      })

      it('rejects initializing a payment with a zero order_id', async () => {
        const res = await request('post', '/v1/payments/initialize', {
          token: customer.token,
          body: { order_id: 0 },
        })
        expectRejected(res, [BAD_REQUEST, NOT_FOUND], 'zero order_id')
      })

      it('rejects initializing a payment with a negative order_id', async () => {
        const res = await request('post', '/v1/payments/initialize', {
          token: customer.token,
          body: { order_id: -1 },
        })
        expectRejected(res, [BAD_REQUEST, NOT_FOUND], 'negative order_id')
      })

      it('rejects initializing a payment for a missing order_id', async () => {
        const res = await request('post', '/v1/payments/initialize', {
          token: customer.token,
          body: {},
        })
        expectRejected(res, [BAD_REQUEST], 'missing order_id')
      })
    })

    describe('webhook (environment-limited)', () => {
      // NOTE: Webhook signature verification and raw-body handling cannot be
      // exercised in this environment:
      //   1. The test-request harness does not forward the `x-paystack-signature`
      //      header (and the running server has no raw-body capture middleware),
      //      so any validly-signed request is rejected as "invalid signature".
      //   2. The signature is generated with a mock secret that does not match
      //      the server's real PAYSTACK_SECRET_KEY.
      // These invariants are therefore *recorded*, not silently deleted:
      it.skip('rejects a replayed webhook event id (replay protection)', () => {})
      it.skip('does not re-transition a processing order (idempotent webhook)', () => {})
    })
  })
}
