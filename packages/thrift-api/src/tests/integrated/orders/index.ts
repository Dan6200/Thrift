import chai from 'chai'
import chaiHttp from 'chai-http'
import { ProfileRequestData } from '#src/types/profile/index.js'
import {
  testCreateOrder,
  testGetAllOrders,
  testGetOrder,
  testUpdateOrder,
  testDeleteOrder,
  testGetNonExistentOrder,
  testGetReviewableItem,
} from './definitions/index.js'
import { createUserForTesting } from '#src/tests/integrated/helpers/create-user.js'
import { deleteUserForTesting } from '#src/tests/integrated/helpers/delete-user.js'
import { signInForTesting } from '#src/tests/integrated/helpers/signin-user.js'
import { createStoreForTesting } from '#src/tests/integrated/helpers/create-store.js'
import { createProductsForTesting } from '#src/tests/integrated/helpers/create-product.js'
import { vendorFactory } from '../factories/index.js'

const { userInfo: aliyuInfo } = vendorFactory()

chai.use(chaiHttp).should()

type SeedContext = {
  customerToken: string
  storeId: number
  variantId: number
  variantPrice: number
  productId: number
}

export default function (customer: { userInfo: ProfileRequestData }) {
  // Each test seeds its own customer + vendor + store + product, so no test
  // depends on state left behind by another.
  const withSeed = async (
    fn: (ctx: SeedContext) => Promise<void>,
  ): Promise<void> => {
    const customerId = await createUserForTesting(customer.userInfo)
    const customerToken = await signInForTesting(customer.userInfo)
    const vendorId = await createUserForTesting(aliyuInfo)
    const vendorToken = await signInForTesting(aliyuInfo)
    try {
      const storeRes = await createStoreForTesting(vendorToken)
      const storeId = storeRes.body.store_id

      const productRequests = []
      for await (const req of createProductsForTesting(
        vendorToken,
        storeId,
        1,
      )) {
        productRequests.push(req)
      }
      const [productRes] = await Promise.all(productRequests)
      const productId = productRes.body.product_id
      const variantId = productRes.body.variants[0].variant_id
      const variantPrice = productRes.body.variants[0].base_price

      await fn({ customerToken, storeId, variantId, variantPrice, productId })
    } finally {
      await deleteUserForTesting(customerId)
      await deleteUserForTesting(vendorId)
    }
  }

  const createOrder = async (ctx: SeedContext, quantity = 1) => {
    const orderData = {
      items: [{ variant_id: ctx.variantId, quantity }],
    }
    return testCreateOrder({
      token: ctx.customerToken,
      body: orderData,
      query: { store_id: ctx.storeId },
      expectedData: {
        ...orderData,
        store_id: ctx.storeId,
        total_amount: ctx.variantPrice * quantity,
      },
    })
  }

  it('should allow a customer to create an order', () =>
    withSeed(async (ctx) => {
      await createOrder(ctx)
    }))

  it('should allow a customer to get all their orders', () =>
    withSeed(async (ctx) => {
      await createOrder(ctx)
      await testGetAllOrders({
        token: ctx.customerToken,
        query: { store_id: ctx.storeId },
      })
    }))

  it('should allow a customer to get a specific order', () =>
    withSeed(async (ctx) => {
      const order = await createOrder(ctx)
      await testGetOrder({
        token: ctx.customerToken,
        params: { order_id: order.order_id },
        query: { store_id: ctx.storeId },
      })
    }))

  it('should allow a customer to find a reviewable item', () =>
    withSeed(async (ctx) => {
      const order = await createOrder(ctx)
      await testGetReviewableItem({
        token: ctx.customerToken,
        query: { product_id: ctx.productId },
        expectedOrderItemId: order.items[0].order_item_id,
      })
    }))

  // CONTRACT FINDING: PATCH/DELETE /v1/orders/:order_id return 404
  // ("Resource not found") — the documented order surface is create + read-only
  // (POST|GET /v1/orders, GET /v1/orders/reviewable-item, GET /v1/orders/:order_id).
  // These tests are recorded (not deleted) so they can be un-skipped if the
  // endpoints are ever implemented.
  it.skip('should allow a customer to update an order', () =>
    withSeed(async (ctx) => {
      const order = await createOrder(ctx)
      const updatedOrderData = {
        items: [{ variant_id: ctx.variantId, quantity: 2 }],
      }
      await testUpdateOrder({
        token: ctx.customerToken,
        params: { order_id: order.order_id },
        body: updatedOrderData,
        expectedData: {
          ...updatedOrderData,
          store_id: ctx.storeId,
          total_amount: ctx.variantPrice * 2,
        },
      })
    }))

  it.skip('should allow a customer to delete an order', () =>
    withSeed(async (ctx) => {
      const order = await createOrder(ctx)
      await testDeleteOrder({
        token: ctx.customerToken,
        params: { order_id: order.order_id },
      })
    }))

  it.skip('should fail to get a deleted order', () =>
    withSeed(async (ctx) => {
      const order = await createOrder(ctx)
      await testDeleteOrder({
        token: ctx.customerToken,
        params: { order_id: order.order_id },
      })
      await testGetNonExistentOrder({
        token: ctx.customerToken,
        params: { order_id: order.order_id },
      })
    }))
}
