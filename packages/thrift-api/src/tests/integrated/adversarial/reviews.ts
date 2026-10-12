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

chai.use(chaiHttp).should()

const { BAD_REQUEST, NOT_FOUND, CONFLICT, CREATED, FORBIDDEN } = StatusCodes

const aisha = loadUserData(
  'src/tests/integrated/data/users/customers/user-aisha',
)
const ebuka = loadUserData(
  'src/tests/integrated/data/users/customers/user-ebuka',
)

export default function () {
  describe('Adversarial: Product Reviews', () => {
    let catalog: Awaited<ReturnType<typeof seedVendorCatalog>>
    let customer: { id: string; token: string }
    let nonPurchaser: { id: string; token: string }

    before(async () => {
      catalog = await seedVendorCatalog()
      customer = await seedUser(uniqueUser(aisha.userInfo))
      nonPurchaser = await seedUser(uniqueUser(ebuka.userInfo))
    })

    after(async () => {
      await deleteUserForTesting(customer.id)
      await deleteUserForTesting(nonPurchaser.id)
      await deleteUserForTesting(catalog.vendor.id)
    })

    /** Create a fresh order and return its (unique) order_item_id. */
    const newOrderItem = async (): Promise<number> => {
      const orderRes = await request('post', '/v1/orders', {
        token: customer.token,
        query: { store_id: catalog.storeId },
        body: { items: [{ variant_id: catalog.variantId, quantity: 1 }] },
      })
      orderRes.should.have.status(CREATED)
      return orderRes.body.items[0].order_item_id as number
    }

    const createReview = (
      orderItemId: number,
      body: unknown,
      token = customer.token,
    ) => request('post', `/v1/reviews/products/${orderItemId}`, { token, body })

    describe('rating boundaries', () => {
      it('rejects a rating below 0', async () => {
        const res = await createReview(await newOrderItem(), {
          rating: -0.01,
          customer_remark: 'x',
        })
        expectRejected(res, [BAD_REQUEST], 'rating below 0')
        expectErrorMessage(res, 'rating below 0')
      })

      it('rejects a rating above 5', async () => {
        const res = await createReview(await newOrderItem(), {
          rating: 5.01,
          customer_remark: 'x',
        })
        expectRejected(res, [BAD_REQUEST], 'rating above 5')
      })

      it('rejects a non-numeric rating', async () => {
        const res = await createReview(await newOrderItem(), {
          rating: 'five',
          customer_remark: 'x',
        })
        expectRejected(res, [BAD_REQUEST], 'non-numeric rating')
      })

      it('rejects a review with a missing rating', async () => {
        const res = await createReview(await newOrderItem(), {
          customer_remark: 'x',
        })
        expectRejected(res, [BAD_REQUEST], 'missing rating')
      })
    })

    describe('uniqueness', () => {
      it('rejects a duplicate review for the same order item', async () => {
        const orderItemId = await newOrderItem()
        const first = await createReview(orderItemId, {
          rating: 4,
          customer_remark: 'ok',
        })
        first.should.have.status(CREATED)
        const dup = await createReview(orderItemId, {
          rating: 5,
          customer_remark: 'again',
        })
        // CONTRACT FINDING: a second review on the same order item surfaces the
        // DB unique constraint as a raw 500 instead of a client-facing 400/409.
        // This test intentionally fails until the duplicate is rejected
        // gracefully.
        expectRejected(dup, [BAD_REQUEST, CONFLICT], 'duplicate review')
      })
    })

    describe('authorization & ownership', () => {
      it('rejects reviewing a non-existent order item', async () => {
        const res = await request('post', '/v1/reviews/products/999999999', {
          token: customer.token,
          body: { rating: 4, customer_remark: 'x' },
        })
        expectRejected(res, [NOT_FOUND], 'non-existent order item')
      })

      it('rejects a non-purchaser reviewing my order item', async () => {
        const res = await createReview(
          await newOrderItem(),
          { rating: 4, customer_remark: 'x' },
          nonPurchaser.token,
        )
        expectRejected(res, [FORBIDDEN, NOT_FOUND], 'non-purchaser review')
      })

      it('rejects a non-purchaser deleting my review', async () => {
        const orderItemId = await newOrderItem()
        const created = await createReview(orderItemId, {
          rating: 4,
          customer_remark: 'x',
        })
        created.should.have.status(CREATED)
        const res = await request(
          'delete',
          `/v1/reviews/products/${orderItemId}`,
          { token: nonPurchaser.token },
        )
        expectRejected(res, [FORBIDDEN, NOT_FOUND], 'non-purchaser delete')
      })
    })
  })
}
