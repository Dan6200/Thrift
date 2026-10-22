import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import { createHmac, randomUUID } from 'node:crypto'
import {
  request,
  expectRejected,
  uniqueUser,
  seedUser,
  seedVendorCatalog,
  SERVER,
} from './helpers.js'
import { userFactory } from '../factories/index.js'
import { deleteUserForTesting } from '../helpers/delete-user.js'
import { knex } from '#src/db/index.js'

chai.use(chaiHttp).should()

const { BAD_REQUEST, NOT_FOUND, CREATED, OK } = StatusCodes

const aisha = userFactory({ isCustomer: true })

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

    describe('webhook replay & idempotency', () => {
      // The signature is computed with the same PAYSTACK_SECRET_KEY the running
      // server loaded (src/tests/load-env.ts mirrors src/server.ts), so the
      // webhook reaches the real handler instead of being rejected as unsigned.
      const sign = (payload: unknown) =>
        createHmac('sha512', process.env.PAYSTACK_SECRET_KEY as string)
          .update(JSON.stringify(payload))
          .digest('hex')

      const postWebhook = (payload: unknown, signature: string) =>
        chai
          .request(SERVER)
          .post('/v1/payments/webhook')
          .set('x-paystack-signature', signature)
          .set('Content-Type', 'application/json')
          .send(payload as any)

      const giveOrderAReference = async (orderId: number) => {
        const reference = `ADV_REF_${randomUUID()}`
        await knex('orders')
          .where({ order_id: orderId })
          .update({ payment_reference: reference })
        return reference
      }

      const chargeSuccessPayload = (
        orderId: number,
        reference: string,
        eventId = `evt_${randomUUID()}`,
      ) => ({
        id: eventId,
        event: 'charge.success',
        data: {
          reference,
          status: 'success',
          metadata: { order_id: orderId },
        },
      })

      it('processes a replayed webhook event id only once', async () => {
        const orderId = await makePendingOrder()
        const reference = await giveOrderAReference(orderId)
        const payload = chargeSuccessPayload(orderId, reference)
        const signature = sign(payload)

        const first = await postWebhook(payload, signature)
        first.should.have.status(OK)
        first.body.message.should.include('processing')

        let order = await knex('orders').where({ order_id: orderId }).first()
        order.status.should.equal('processing')

        // Replay the exact same event id.
        const replay = await postWebhook(payload, signature)
        replay.should.have.status(OK)
        replay.body.message.should.include('already processed')

        order = await knex('orders').where({ order_id: orderId }).first()
        order.status.should.equal('processing')
      })

      it('does not re-transition an order that is no longer pending', async () => {
        const orderId = await makePendingOrder()
        const reference = await giveOrderAReference(orderId)
        await knex('orders')
          .where({ order_id: orderId })
          .update({ status: 'processing' })

        const payload = chargeSuccessPayload(orderId, reference)

        const res = await postWebhook(payload, sign(payload))
        res.should.have.status(OK)
        res.body.message.should.include('already processed')

        const order = await knex('orders').where({ order_id: orderId }).first()
        order.status.should.equal('processing')
      })
    })
  })
}
