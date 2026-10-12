import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import {
  request,
  expectRejected,
  expectErrorMessage,
  uniqueUser,
  seedUser,
  seedVendorCatalog,
} from './helpers.js'
import { loadUserData } from '../helpers/load-data.js'
import { deleteUserForTesting } from '../helpers/delete-user.js'
import { knex } from '#src/db/index.js'

chai.use(chaiHttp).should()

const { BAD_REQUEST, NOT_FOUND, FORBIDDEN, CREATED, OK } = StatusCodes

const aisha = loadUserData(
  'src/tests/integrated/data/users/customers/user-aisha',
)
const ebuka = loadUserData(
  'src/tests/integrated/data/users/customers/user-ebuka',
)

export default function () {
  describe('Adversarial: Orders', () => {
    let catalog: Awaited<ReturnType<typeof seedVendorCatalog>>
    let customer: { id: string; token: string }
    let secondCustomer: { id: string; token: string }

    before(async () => {
      catalog = await seedVendorCatalog()
      customer = await seedUser(uniqueUser(aisha.userInfo))
      secondCustomer = await seedUser(uniqueUser(ebuka.userInfo))
    })

    after(async () => {
      await deleteUserForTesting(customer.id)
      await deleteUserForTesting(secondCustomer.id)
      await deleteUserForTesting(catalog.vendor.id)
    })

    const createOrder = (body: unknown, token = customer.token) =>
      request('post', '/v1/orders', {
        token,
        query: { store_id: catalog.storeId },
        body,
      })

    describe('validation & boundary', () => {
      it('rejects an order with an empty items array', async () => {
        const res = await createOrder({ items: [] })
        expectRejected(res, [BAD_REQUEST], 'empty order')
        expectErrorMessage(res, 'empty order')
      })

      it('rejects an order with a zero quantity', async () => {
        const res = await createOrder({
          items: [{ variant_id: catalog.variantId, quantity: 0 }],
        })
        expectRejected(res, [BAD_REQUEST], 'zero quantity')
      })

      it('rejects an order with a negative quantity', async () => {
        const res = await createOrder({
          items: [{ variant_id: catalog.variantId, quantity: -2 }],
        })
        expectRejected(res, [BAD_REQUEST], 'negative quantity')
      })

      it('rejects an order with a non-integer quantity', async () => {
        const res = await createOrder({
          items: [{ variant_id: catalog.variantId, quantity: 1.5 }],
        })
        expectRejected(res, [BAD_REQUEST], 'non-integer quantity')
      })

      it('rejects an order with an unknown variant', async () => {
        const res = await createOrder({
          items: [{ variant_id: 999999999, quantity: 1 }],
        })
        expectRejected(res, [BAD_REQUEST, NOT_FOUND], 'unknown variant')
      })

      it('rejects an order exceeding available stock', async () => {
        const res = await createOrder({
          items: [
            {
              variant_id: catalog.variantId,
              quantity: catalog.variantStock + 1,
            },
          ],
        })
        expectRejected(res, [BAD_REQUEST], 'insufficient stock')
      })
    })

    describe('money arithmetic & state machine', () => {
      it('starts an order in pending status', async () => {
        const res = await createOrder({
          items: [{ variant_id: catalog.variantId, quantity: 1 }],
        })
        res.should.have.status(CREATED)
        const row = await knex('orders')
          .where({ order_id: res.body.order_id })
          .first()
        chai.expect(row.status).to.equal('pending')
      })

      it('computes total_amount as Σ(price × qty) in integer kobo', async () => {
        // Add a second variant so we can exercise multi-item arithmetic.
        const second = await request(
          'post',
          `/v1/products/${catalog.productId}/variants`,
          {
            token: catalog.vendor.token,
            query: { storeId: catalog.storeId },
            body: {
              sku: `ADV-MULTI-${Date.now()}`,
              base_price: 2500,
              quantity_available: 100,
              options: [{ option_name: 'COLOR', value: 'BLUE' }],
            },
          },
        )
        second.should.have.status(CREATED)
        const secondVariantId = second.body.variant_id
        const secondPrice = second.body.base_price

        const qtyA = 2
        const qtyB = 3
        const res = await createOrder({
          items: [
            { variant_id: catalog.variantId, quantity: qtyA },
            { variant_id: secondVariantId, quantity: qtyB },
          ],
        })
        res.should.have.status(CREATED)
        const expectedTotal = catalog.variantPrice * qtyA + secondPrice * qtyB
        chai.expect(Number.isInteger(res.body.total_amount)).to.equal(true)
        chai.expect(res.body.total_amount).to.equal(expectedTotal)
      })
    })

    describe('ownership isolation', () => {
      it('prevents another customer from reading my order', async () => {
        const res = await createOrder({
          items: [{ variant_id: catalog.variantId, quantity: 1 }],
        })
        res.should.have.status(CREATED)
        const orderId = res.body.order_id
        const cross = await request('get', `/v1/orders/${orderId}`, {
          token: secondCustomer.token,
          query: { store_id: catalog.storeId },
        })
        expectRejected(cross, [FORBIDDEN, NOT_FOUND], 'cross-user order read')
      })
    })

    describe('param coercion', () => {
      it('rejects a non-numeric order id', async () => {
        const res = await request('get', '/v1/orders/not-a-number', {
          token: customer.token,
          query: { store_id: catalog.storeId },
        })
        expectRejected(res, [BAD_REQUEST, NOT_FOUND], 'non-numeric order id')
      })

      it('returns not found for a non-existent order id', async () => {
        const res = await request('get', '/v1/orders/999999999', {
          token: customer.token,
          query: { store_id: catalog.storeId },
        })
        res.should.have.status(NOT_FOUND)
      })
    })
  })
}
