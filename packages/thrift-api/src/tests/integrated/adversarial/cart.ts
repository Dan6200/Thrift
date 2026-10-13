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
import { userFactory, vendorFactory } from '../factories/index.js'
import { deleteUserForTesting } from '../helpers/delete-user.js'

chai.use(chaiHttp).should()

const { BAD_REQUEST, NOT_FOUND, FORBIDDEN, CREATED, OK } = StatusCodes

const aisha = userFactory({ isCustomer: true })
const ebuka = userFactory({ isCustomer: true })

export default function () {
  describe('Adversarial: Cart', () => {
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

    const addItem = (body: unknown, token = customer.token) =>
      request('post', '/v1/cart/items', { token, body })

    describe('validation & boundary', () => {
      it('rejects adding an item with a zero quantity', async () => {
        const res = await addItem({
          variant_id: catalog.variantId,
          quantity: 0,
        })
        expectRejected(res, [BAD_REQUEST], 'zero quantity')
        expectErrorMessage(res, 'zero quantity')
      })

      it('rejects adding an item with a negative quantity', async () => {
        const res = await addItem({
          variant_id: catalog.variantId,
          quantity: -1,
        })
        expectRejected(res, [BAD_REQUEST], 'negative quantity')
      })

      it('rejects adding an item with a non-integer quantity', async () => {
        const res = await addItem({
          variant_id: catalog.variantId,
          quantity: 1.5,
        })
        expectRejected(res, [BAD_REQUEST], 'non-integer quantity')
      })

      it('rejects adding an item with a quantity exceeding available stock', async () => {
        const res = await addItem({
          variant_id: catalog.variantId,
          quantity: catalog.variantStock + 1,
        })
        expectRejected(res, [BAD_REQUEST], 'quantity exceeds stock')
      })

      it('rejects adding an item with a non-existent variant_id', async () => {
        const res = await addItem({ variant_id: 999999999, quantity: 1 })
        expectRejected(res, [BAD_REQUEST, NOT_FOUND], 'non-existent variant')
      })

      it('rejects adding an item with a missing variant_id', async () => {
        const res = await addItem({ quantity: 1 })
        expectRejected(res, [BAD_REQUEST], 'missing variant_id')
      })
    })

    describe('update & delete adversarial', () => {
      it('rejects updating an item to a quantity exceeding stock', async () => {
        const added = await addItem({
          variant_id: catalog.variantId,
          quantity: 1,
        })
        added.should.have.status(CREATED)
        const itemId = added.body.item_id
        const res = await request('put', `/v1/cart/items/${itemId}`, {
          token: customer.token,
          body: { quantity: catalog.variantStock + 1 },
        })
        expectRejected(res, [BAD_REQUEST], 'update exceeds stock')
      })

      it('rejects updating a non-existent cart item', async () => {
        const res = await request('put', '/v1/cart/items/999999999', {
          token: customer.token,
          body: { quantity: 1 },
        })
        expectRejected(res, [NOT_FOUND], 'update non-existent item')
      })

      it('rejects removing a non-existent cart item', async () => {
        const res = await request('delete', '/v1/cart/items/999999999', {
          token: customer.token,
        })
        expectRejected(res, [NOT_FOUND], 'remove non-existent item')
      })
    })

    describe('ownership isolation', () => {
      it('prevents another customer from updating my cart item', async () => {
        const added = await addItem({
          variant_id: catalog.variantId,
          quantity: 1,
        })
        added.should.have.status(CREATED)
        const itemId = added.body.item_id
        const res = await request('put', `/v1/cart/items/${itemId}`, {
          token: secondCustomer.token,
          body: { quantity: 2 },
        })
        expectRejected(res, [FORBIDDEN, NOT_FOUND], 'cross-user cart update')
      })

      it('prevents another customer from removing my cart item', async () => {
        const added = await addItem({
          variant_id: catalog.variantId,
          quantity: 1,
        })
        added.should.have.status(CREATED)
        const itemId = added.body.item_id
        const res = await request('delete', `/v1/cart/items/${itemId}`, {
          token: secondCustomer.token,
        })
        expectRejected(res, [FORBIDDEN, NOT_FOUND], 'cross-user cart delete')
      })
    })

    describe('response shape exactness (integer kobo)', () => {
      it('returns integer minor-unit totals and prices', async () => {
        // Use a fresh customer so accumulated state from earlier tests cannot
        // skew the arithmetic assertion.
        const fresh = await seedUser(
          uniqueUser(userFactory({ isCustomer: true }).userInfo),
        )
        try {
          const qty = 3
          const added = await request('post', '/v1/cart/items', {
            token: fresh.token,
            body: { variant_id: catalog.variantId, quantity: qty },
          })
          added.should.have.status(CREATED)
          chai.expect(Number.isInteger(added.body.quantity)).to.equal(true)

          const res = await request('get', '/v1/cart', { token: fresh.token })
          res.should.have.status(OK)
          const body = res.body
          chai.expect(Number.isInteger(body.total_items)).to.equal(true)
          chai.expect(Number.isInteger(body.total_price)).to.equal(true)
          chai.expect(body.total_price).to.equal(catalog.variantPrice * qty)

          for (const item of body.items) {
            chai.expect(Number.isInteger(item.quantity)).to.equal(true)
            if (item.price !== undefined) {
              chai.expect(Number.isInteger(item.price)).to.equal(true)
            }
          }
        } finally {
          await deleteUserForTesting(fresh.id)
        }
      })
    })
  })
}
